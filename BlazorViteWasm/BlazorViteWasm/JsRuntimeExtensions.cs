using Microsoft.JSInterop;

namespace BlazorViteWasm;

public static class JsRuntimeExtensions
{
    public static async Task AlertUser(this IJSRuntime? jsRuntime, string alertText) =>
        await (jsRuntime ?? throw new ArgumentNullException(nameof(jsRuntime)))
            .InvokeVoidAsync("alertUserHelper.alertUser", alertText, "alertText/plain");
}