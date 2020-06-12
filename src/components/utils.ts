// clean up the code query from url after login
export function redirect() {
    // https://stackoverflow.com/a/18396718
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("code")) {
        window.location.replace("/mencius/");
    }
}
