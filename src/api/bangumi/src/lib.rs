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
        Ok(data) => Ok(data),
        Err(err) => Err(napi::Error::from_reason(err.to_string())),
    }
}
