use super::fetch;
use napi_derive::napi;
use scraper::{Html, Selector};

#[napi(object)]
pub struct Data {
    pub id: String,
    pub from: String,
    pub to: String,
}

async fn _user_former_name(user: &str, page: i32) -> napi::Result<(bool, Vec<Data>)> {
    let _type = "say";
    let url = format!("user/{user}/timeline?ajax=1&type={_type}&page={page}");
    let content = fetch(url).await?;
    let html = Html::parse_fragment(&content);
    let selector = Selector::parse("li.tml_item").unwrap();
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
                result.push(Data {
                    id,
                    from: select.get(0).unwrap().to_string(),
                    to: select.get(1).unwrap().to_string(),
                })
            }
        }
    });
    Ok((end, result))
}

#[napi]
pub async fn user_former_name(user: String, last: Option<String>) -> napi::Result<Vec<Data>> {
    let mut result = Vec::new();
    let mut page = 1;
    loop {
        let (end, mut data) = _user_former_name(&user, page).await?;
        if end {
            break;
        }
        if let Some(last) = last.clone() {
            if data.iter().any(|item| item.id == last) {
                data = data
                    .into_iter()
                    .take_while(|item| item.id != last)
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
