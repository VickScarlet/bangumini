pub mod user;

async fn _fetch(url: String) -> Result<String, reqwest::Error> {
    let resp = reqwest::get(url).await?;
    resp.text().await
}

pub async fn fetch(sub: String) -> napi::Result<String> {
    let url = format!("https://bgm.tv/{sub}");
    match _fetch(url).await {
        Ok(data) => Ok(data),
        Err(err) => Err(napi::Error::from_reason(err.to_string())),
    }
}
