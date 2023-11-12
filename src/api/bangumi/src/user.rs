use std::collections::HashMap;

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
pub async fn user_former_name_all(
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

#[napi(object)]
pub struct FormerNameResult {
    pub data: Vec<FormerName>,
    pub done: bool,
    pub next: Option<i32>,
}

#[napi]
pub async fn user_former_name(
    user: String,
    last: Option<i32>,
    next: Option<i32>,
) -> napi::Result<Option<FormerNameResult>> {
    let page = next.unwrap_or(1);
    let data = _user_former_name(&user, page).await?;
    if data.is_none() {
        return Ok(None);
    }
    let mut data = data.unwrap();
    if let Some(last) = last.clone() {
        if data.iter().any(|item| item.tml == last) {
            data = data
                .into_iter()
                .take_while(|item| item.tml != last)
                .collect();
        }
    }
    let done = data.len() == 0;
    let next = if done { None } else { Some(page + 1) };
    return Ok(Some(FormerNameResult { data, done, next }));
}

#[napi(object)]
pub struct ProgressActivity {
    pub time: String,
    pub activity: i32,
}
async fn _user_progress_activity(
    user: &str,
    page: i32,
) -> napi::Result<Option<Vec<ProgressActivity>>> {
    let html = _timeline(user, "progress", page).await?;
    if html.is_none() {
        return Ok(None);
    }
    let mut result = Vec::new();
    _with_date(&html.unwrap(), |time, ul| {
        let selector = Selector::parse("li.tml_item").unwrap();
        let activity = ul.select(&selector).collect::<Vec<_>>().len();
        if activity > 0 {
            result.push(ProgressActivity {
                time: time.to_string(),
                activity: activity as i32,
            });
        }
    });
    result.sort_by(|a, b| {
        let a = chrono::NaiveDate::parse_from_str(&a.time, "%Y-%m-%d").unwrap();
        let b = chrono::NaiveDate::parse_from_str(&b.time, "%Y-%m-%d").unwrap();
        b.cmp(&a)
    });
    Ok(Some(result))
}

#[napi]
pub async fn user_progress_activity_all(
    user: String,
    last: Option<String>,
) -> napi::Result<Option<Vec<ProgressActivity>>> {
    let mut result = HashMap::new();
    let mut page = 1;
    loop {
        let data = _user_progress_activity(&user, page).await;
        if data.is_err() {
            return Ok(None);
        }
        let data = data.unwrap();
        if data.is_none() {
            break;
        }
        let mut data = data.unwrap();
        if let Some(last) = last.clone() {
            data = data
                .into_iter()
                .take_while(|item| {
                    let time = chrono::NaiveDate::parse_from_str(&item.time, "%Y-%m-%d").unwrap();
                    let last = chrono::NaiveDate::parse_from_str(&last, "%Y-%m-%d").unwrap();
                    time < last
                })
                .collect();
        }
        if data.len() == 0 {
            break;
        }
        data.iter().for_each(|item| {
            let time = &item.time;
            let activity = item.activity;
            let old = result.get(&time.clone()).unwrap_or(&0);
            result.insert(time.clone(), activity + old);
        });

        if page == 999 {
            break;
        }

        page += 1;
    }
    let mut result = result
        .into_iter()
        .map(|(time, activity)| ProgressActivity { time, activity })
        .collect::<Vec<_>>();
    result.sort_by(|a, b| {
        let a = chrono::NaiveDate::parse_from_str(&a.time, "%Y-%m-%d").unwrap();
        let b = chrono::NaiveDate::parse_from_str(&b.time, "%Y-%m-%d").unwrap();
        b.cmp(&a)
    });
    Ok(Some(result))
}

#[napi(object)]
pub struct ProgressActivityResult {
    pub data: Vec<ProgressActivity>,
    pub done: bool,
    pub next: Option<i32>,
}
#[napi]
pub async fn user_progress_activity(
    user: String,
    last: Option<String>,
    next: Option<i32>,
) -> napi::Result<Option<ProgressActivityResult>> {
    let page = next.unwrap_or(1);
    let data = _user_progress_activity(&user, page).await?;
    if data.is_none() {
        return Ok(None);
    }
    let mut data = data.unwrap();
    if let Some(last) = last.clone() {
        data = data
            .into_iter()
            .take_while(|item| {
                let time = chrono::NaiveDate::parse_from_str(&item.time, "%Y-%m-%d").unwrap();
                let last = chrono::NaiveDate::parse_from_str(&last, "%Y-%m-%d").unwrap();
                time < last
            })
            .collect();
    }
    let done = data.len() == 0 || page == 999;
    let next = if done { None } else { Some(page + 1) };
    Ok(Some(ProgressActivityResult { data, done, next }))
}
