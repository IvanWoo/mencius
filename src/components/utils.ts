// clean up the code query from url after login
export function cleanUrlQuery() {
    if (!window.location.search) return;

    // https://stackoverflow.com/a/41542008
    const url = new URL(window.location.toString());
    const searchParams = new URLSearchParams(url.search);
    searchParams.delete("code");
    url.search = searchParams.toString();

    window.history.pushState({}, "", url.toString());
}
