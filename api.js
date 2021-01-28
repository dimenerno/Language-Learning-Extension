let sentence = "안녕 내 이름은 지호야.";
var client_id = "cVQsW0KsGu6ulBqBWx9T";
var client_secret = "DNMvKtdLLc";

var options = {
    method : "POST",
    body: {'source':'ko', 'target':'en', 'text':sentence},
    headers : {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Naver-Client-Id':client_id,
        'X-Naver-Client-Secret': client_secret
    }
}
fetch('https://openapi.naver.com/v1/papago/n2mt', options).then((response) => console.log(response));