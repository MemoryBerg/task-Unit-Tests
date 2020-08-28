describe('pizza.js', () => {

    let pizza = new Pizza();
    let pizza2 = new Pizza();

    describe('Pizza', () => {
        beforeEach(() => {
            let toppings = {
                bacon: 0.8,
                pepperoni: 0.75,
                sausage: 0.5,
                ham: 0.5,
                pineapple: 0.5,
                olives: 0.3,
                corn: 0.25,
                mushrooms: 0.25
            };
            const size = {
                small: 1,
                medium: 1.5,
                large: 2
            };

            pizza = new Pizza(['bacon', 'ham'], 'small');
            pizza2 = new Pizza(['pepperoni', 'corn'], 'large');
        });


        it('should create pizza', () => {
            expect(pizza).toBeTruthy();
        });

        it('should create different pizzas', () => {
            expect(pizza).not.toEqual(pizza2);
        });

        describe('pizzaPrice', () => {

            it('should be a number', () => {
                expect(pizza.toppingsPrice).toBeNumber();
            });

            it('to check correct price', () => {
                expect(pizza.pizzaPrice).toBe(1.3)
            });

            it('handles wrong size', () => {
                pizza = new Pizza(['bacon', 'ham'], 'grande');
                expect(() => pizza.pizzaPrice).toThrow();
                expect(() => pizza.pizzaPrice).toThrowError(Error, `Size can't find`);
            });

        });

        describe('toppingsPrice', () => {

            it('handles wrong toppings', () => {
                pizza = new Pizza(['iron', 'frost'], 'small');
                expect(() => pizza.toppingsPrice).toThrow();
                expect(() => pizza.toppingsPrice).toThrowError(Error, `Topping iron can't find`);
            });

        });

    });

});