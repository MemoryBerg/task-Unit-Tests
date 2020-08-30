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


        describe('addPizza()', () => {

            it('should be called', () => {
                const spy = spyOn(order, 'addPizza');
                const pizza = { topping: 'ham', size: 'small' }
                order.addPizza(pizza)
                expect(order.addPizza).toHaveBeenCalled();
                expect(order.addPizza).toHaveBeenCalledTimes(1);
                expect(order.addPizza).toHaveBeenCalledWith(pizza);
            });

            it('adds pizza to pizzas array', () => {
                pizza = { toppings: ['ham'], size: 'small' };
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
            let spy;
            let testPizza;

            beforeEach(() => {
                spy = spyOnProperty(order, 'totalPrice').and.callThrough();
            })

            it('should be a number', () => {
                testPizza = { pizzaPrice: 2, toppings: ['ham'], size: 'small' };
                order.addPizza(testPizza);
                expect(order.totalPrice).toBeNumber();
            });

            it('handles pizzaPrice are 0', () => {
                testPizza = { pizzaPrice: 0, toppings: ['ham'], size: 'small' };
                order.addPizza(testPizza);
                expect(() => order.totalPrice).toThrow();
                expect(() => order.totalPrice).toThrowError(`Pizza can't cost 0 USD`);
            });

            it(`handles if pizza doesn't have a price`, () => {
                testPizza = { toppings: ['ham'], size: 'small' };
                order.addPizza(testPizza);
                expect(() => order.totalPrice).toThrow();
                expect(() => order.totalPrice).toThrowError(`Pizza must have a price`);
            });

            it('should return correct total price', () => {
                expect(order.totalPrice).toBe(0);
            })

            afterEach(() => {
                order.removePizza(testPizza);
            })

        });
    });
})
