/**
 * @example
 * export default new Event('ready', (client) => {
 *    console.log('ready')
 * })
 */
export class Event {
    name;
    execute;
    options;
    constructor(name, execute, options) {
        this.name = name;
        this.execute = execute;
        this.options = options;
    }
    static isEvent(event) {
        return event instanceof Event;
    }
    static async waitUntil(client, event, checkFunction = () => true, timeout) {
        return await new Promise((resolve) => {
            let timeoutID;
            if (timeout !== undefined) {
                timeoutID = setTimeout(() => {
                    client.off(event, eventFunction);
                    resolve([]);
                }, timeout);
            }
            const eventFunction = (...args) => {
                if (checkFunction(...args)) {
                    resolve(args);
                    client.off(event, eventFunction);
                    if (timeoutID !== undefined)
                        clearTimeout(timeoutID);
                }
            };
            client.on(event, eventFunction);
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXZlbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RydWN0dXJlcy9FdmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQTs7Ozs7R0FLRztBQUNILE1BQU0sT0FBTyxLQUFLO0lBRVA7SUFDQTtJQUNBO0lBSFQsWUFDUyxJQUFPLEVBQ1AsT0FBeUIsRUFDekIsT0FBc0I7UUFGdEIsU0FBSSxHQUFKLElBQUksQ0FBRztRQUNQLFlBQU8sR0FBUCxPQUFPLENBQWtCO1FBQ3pCLFlBQU8sR0FBUCxPQUFPLENBQWU7SUFDNUIsQ0FBQztJQUVKLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBYztRQUMzQixPQUFPLEtBQUssWUFBWSxLQUFLLENBQUE7SUFDL0IsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUNwQixNQUFpQixFQUNqQixLQUFRLEVBQ1IsZ0JBQXVELEdBQUcsRUFBRSxDQUFDLElBQUksRUFDakUsT0FBZ0I7UUFFaEIsT0FBTyxNQUFNLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDbkMsSUFBSSxTQUF5QixDQUFBO1lBQzdCLElBQUksT0FBTyxLQUFLLFNBQVMsRUFBRTtnQkFDekIsU0FBUyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEVBQUU7b0JBQzFCLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFBO29CQUNoQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUE7Z0JBQ2IsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFBO2FBQ1o7WUFDRCxNQUFNLGFBQWEsR0FBRyxDQUFDLEdBQUcsSUFBcUIsRUFBUSxFQUFFO2dCQUN2RCxJQUFJLGFBQWEsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFO29CQUMxQixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7b0JBQ2IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUE7b0JBQ2hDLElBQUksU0FBUyxLQUFLLFNBQVM7d0JBQUUsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFBO2lCQUNyRDtZQUNILENBQUMsQ0FBQTtZQUNELE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFBO1FBQ2pDLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQztDQUNGIn0=