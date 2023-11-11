mod config;
pub mod user;

async fn _fetch(url: String) -> Result<String, reqwest::Error> {
    reqwest::Client::builder()
        .cookie_store(true)
        .build()?
        .get(&url)
        .header(reqwest::header::USER_AGENT, config::USER_AGENT)
        .header(reqwest::header::COOKIE, config::COOKIE)
        .send()
        .await?
        .text()
        .await
}

#[napi_derive::napi]
pub async fn fetch(sub: String) -> napi::Result<String> {
    let url = format!("https://bgm.tv/{sub}");
    match _fetch(url).await {
        Ok(data) => {
            if regex::Regex::new(r"呜咕，出错了").unwrap().is_match(&data) {
                Err(napi::Error::from_reason("呜咕，出错了".to_string()))
            } else {
                Ok(data)
            }
        }
        Err(err) => Err(napi::Error::from_reason(err.to_string())),
    }
}

#[napi_derive::napi]
pub fn convert_date(time: String) -> Option<String> {
    match time.trim() {
        "今天" => {
            let now = chrono::Local::now();
            Some(now.format("%Y-%m-%d").to_string())
        }
        "昨天" => {
            let now = chrono::Local::now();
            let time = now - chrono::Duration::days(1);
            Some(time.format("%Y-%m-%d").to_string())
        }
        "前天" => {
            let now = chrono::Local::now();
            let time = now - chrono::Duration::days(2);
            Some(time.format("%Y-%m-%d").to_string())
        }
        _ => {
            let re = regex::Regex::new(r"(\d{4})-(\d{1,2})-(\d{1,2})").unwrap();
            if let Some(caps) = re.captures(&time) {
                Some(format!(
                    "{:0>4}-{:0>2}-{:0>2}",
                    &caps[1], &caps[2], &caps[3]
                ))
            } else {
                None
            }
        }
    }
}
