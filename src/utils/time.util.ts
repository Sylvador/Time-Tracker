export class Time {
    static deltaTime = 0;
    static lastTickTime = Date.now();

    static setDeltaTime() {
        const tickTime = Date.now();
        Time.deltaTime = tickTime - Time.lastTickTime;
        Time.lastTickTime = tickTime;
    }
}
