use super::fetch;
use napi_derive::napi;
use regex::Regex;
use scraper::{Html, Selector};

#[napi(object)]
pub struct FormerName {
    pub tml: i32,
    pub before: String,
    pub after: String,
}

async fn _user_former_name(user: &str, page: i32) -> napi::Result<(bool, Vec<FormerName>)> {
    let _type = "say";
    let url = format!("user/{user}/timeline?ajax=1&type={_type}&page={page}");
    let content = fetch(url).await?;
    let html = Html::parse_fragment(&content);
    let selector = Selector::parse("li.tml_item").unwrap();
    let re = Regex::new(r"tml_(\d+)").unwrap();
    let mut result = Vec::new();
    let mut end = true;
    html.select(&selector).for_each(|element| {
        end = false;
        if let Some(id) = element.value().id().map(|id| id.to_string()) {
            let selector = Selector::parse("p.status>strong").unwrap();
            let select = element
                .select(&selector)
                .map(|element| element.text().collect::<Vec<_>>().join(""))
                .collect::<Vec<String>>();
            if select.len() == 2 {
                result.push(FormerName {
                    tml: re.captures(&id).unwrap()[1].parse().unwrap(),
                    before: select.get(0).unwrap().to_string(),
                    after: select.get(1).unwrap().to_string(),
                })
            }
        }
    });
    Ok((end, result))
}

#[napi]
pub async fn user_former_name(user: String, last: Option<i32>) -> napi::Result<Vec<FormerName>> {
    let mut result = Vec::new();
    let mut page = 1;
    loop {
        let (end, mut data) = _user_former_name(&user, page).await?;
        if end {
            break;
        }
        if let Some(last) = last.clone() {
            if data.iter().any(|item| item.tml == last) {
                data = data
                    .into_iter()
                    .take_while(|item| item.tml != last)
                    .collect();
                result.append(&mut data);
                break;
            }
        }
        result.append(&mut data);
        page += 1;
    }
    Ok(result)
}
