describe('order.js', () => {
    let order = new Order();
    let order2 = new Order();
    let pizza;

    describe('Order', () => {

        beforeEach(() => {
            order = new Order();
            order2 = new Order();
        });

        it('has common operations', () => {
            expect(order.addPizza).toBeDefined();
            expect(order.removePizza).not.toBeUndefined();
        });

        it('instantiates unique object', () => {
            expect(order).not.toBe(order2);
        });
    });

    describe('addPizza()', () => {

        it('should be called', () => {
            const spy = spyOn(Order.prototype, 'addPizza');
            order.addPizza({ topping: 'ham', size: 'small' })
            expect(spy).toHaveBeenCalled();
        });

        it('adds pizza to pizzas array', () => {
            pizza = { pizzaPrice: 5, toppings: ['ham'], size: 'small' };
            order.addPizza(pizza)
            expect(order.pizzas.includes(pizza)).toBeTruthy()
        });
    });

    describe('removePizza', () => {

        it('remove pizza from pizzas array', () => {
            order.removePizza(pizza);
            expect(order.pizzas.includes(pizza)).toBeFalsy();
        });
    })

    describe('totalPrice', () => {

        it('should be a number', () => {
            expect(order.totalPrice).toBeNumber();
        });

        it('handles pizzaPrice are 0', () => {
            const testPizza = { pizzaPrice: 0, toppings: ['bacon'], size: 'medium' };
            order.addPizza(testPizza);
            expect(() => order.totalPrice).toThrow();
            expect(() => order.totalPrice).toThrowError(`Pizza can't cost 0 USD`);
            order.removePizza(testPizza);
        });

        it('handles if pizza have a price', () => {
            const testPizza = { toppings: ['bacon'], size: 'medium' };
            order.addPizza(testPizza);
            expect(() => order.totalPrice).toThrow();
            expect(() => order.totalPrice).toThrowError(`Pizza must have a price`);
            order.removePizza(testPizza);
        })

    });
})