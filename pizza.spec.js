
describe('pizza.js', () => {

    let pizza;
    let pizza2;

    describe('Pizza', () => {
        beforeEach(() => {
            // const toppings = undefined;
            // const toppings = {
            //     bacon: 0.8,
            //     pepperoni: 0.75,
            //     sausage: 0.5,
            //     ham: 0.5,
            //     pineapple: 0.5,
            //     olives: 0.3,
            //     corn: 0.25,
            //     mushrooms: 0.25
            // };
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

            it('should return correct price', () => {
                expect(pizza.pizzaPrice).toBe(1.3);

            });

            it('handles wrong size', () => {
                pizza = new Pizza(['bacon', 'ham'], 'grande');
                expect(pizza.pizzaPrice).toBe(0);
            });

        });

        describe('toppingsPrice', () => {

            it('handles wrong toppings', () => {
                pizza = new Pizza(['iron', 'frost'], 'small');
                expect(() => pizza.toppingsPrice).toThrow();
                expect(() => pizza.toppingsPrice).toThrowError(Error, `Topping iron can't find`);
            });

            it('should return correct toppings price', () => {
                const spy = spyOnProperty(pizza, 'toppingsPrice').and.returnValue(1.3);
                expect(pizza.toppingsPrice).toBe(1.3);
                expect(spy).toHaveBeenCalled();
            });

            it('handle if toppings are not an array', () => {
                const pizza3 = new Pizza({ topping: 'ham' }, 'large');
                expect(() => pizza3.toppingsPrice).toThrowError('this.toppings.reduce is not a function')
            })
        });
    });
});