use super::{convert_date, fetch};
use napi_derive::napi;
use regex::Regex;
use scraper::{ElementRef, Html, Selector};

async fn _timeline(user: &str, _type: &str, page: i32) -> napi::Result<Option<Html>> {
    let url = format!("user/{user}/timeline?ajax=1&type={_type}&page={page}");
    let content = fetch(url).await?;
    let html = Html::parse_fragment(&content);
    let selector = Selector::parse("#timeline").unwrap();
    if html.select(&selector).next().is_some() {
        Ok(Some(html))
    } else {
        Ok(None)
    }
}

fn _with_date<'a>(html: &'a Html, mut cb: impl FnMut(&str, ElementRef)) -> () {
    let selector = Selector::parse("#timeline > *").unwrap();
    let mut children = html.select(&selector);
    loop {
        let element = children.next();
        if element.is_none() {
            break;
        }
        let element = element.unwrap();
        if !element.value().classes().any(|class| class == "Header") {
            continue;
        }
        let time = element.text().collect::<Vec<_>>().join("");
        let time = convert_date(time);
        if time.is_none() {
            continue;
        }
        let ul = children.next();
        if ul.is_none() {
            break;
        }
        cb(&time.unwrap(), ul.unwrap())
    }
}

#[napi(object)]
pub struct FormerName {
    pub tml: i32,
    pub time: String,
    pub before: String,
    pub after: String,
}

async fn _user_former_name(user: &str, page: i32) -> napi::Result<Option<Vec<FormerName>>> {
    let html = _timeline(user, "say", page).await?;
    if html.is_none() {
        return Ok(None);
    }
    let re_tml = Regex::new(r"tml_(\d+)").unwrap();
    let mut result = Vec::new();
    _with_date(&html.unwrap(), |time, ul| {
        let selector = Selector::parse("li.tml_item").unwrap();
        ul.select(&selector).for_each(|element| {
            if let Some(id) = element.value().id().map(|id| id.to_string()) {
                let selector = Selector::parse("p.status>strong").unwrap();
                let select = element
                    .select(&selector)
                    .map(|element| element.text().collect::<Vec<_>>().join(""))
                    .collect::<Vec<String>>();
                if select.len() == 2 {
                    result.push(FormerName {
                        tml: re_tml.captures(&id).unwrap()[1].parse().unwrap(),
                        before: select.get(0).unwrap().to_string(),
                        after: select.get(1).unwrap().to_string(),
                        time: time.to_string(),
                    })
                }
            }
        });
    });
    Ok(Some(result))
}

#[napi]
pub async fn user_former_name(
    user: String,
    last: Option<i32>,
) -> napi::Result<Option<Vec<FormerName>>> {
    let mut result = Vec::new();
    let mut page = 1;
    loop {
        let data = _user_former_name(&user, page).await;
        if data.is_err() {
            return Ok(None);
        }
        let data = data.unwrap();
        if data.is_none() {
            break;
        }
        let mut data = data.unwrap();
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
    Ok(Some(result))
}
