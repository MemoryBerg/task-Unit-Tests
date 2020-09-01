describe('appController.js', () => {
    let appController;
    let orderElem;
    let form;

    beforeEach(() => {
        appController = new AppController();

        orderElem = document.createElement('div');
        orderElem.classList.add('container');
        document.body.appendChild(orderElem);
        form = `<form class="pizza-editor mb-20" style="display: none">
        <div class="size mb-15">
            <h5 class="is-size-5">Size:</h5>
            <label class="radio"><input type="radio" name="size" value="small">Small</label>
            <label class="radio"><input type="radio" name="size" value="medium">Medium</label>
            <label class="radio"><input type="radio" name="size" value="large">Large</label>
        </div>
        <div class="toppings">
            <h5 class="is-size-5">Toppings:</h5>
            <label class="checkbox"><input type="checkbox" value="bacon" name="toppings">Bacon</label>
            <label class="checkbox"><input type="checkbox" value="pepperoni" name="toppings">Pepperoni</label>
            <label class="checkbox"><input type="checkbox" value="sausage" name="toppings">Sausage</label>
            <label class="checkbox"><input type="checkbox" value="ham" name="toppings">Ham</label>
            <label class="checkbox"><input type="checkbox" value="pineapple" name="toppings">Pineapple</label>
            <label class="checkbox"><input type="checkbox" value="olives" name="toppings">Olives</label>
            <label class="checkbox"><input type="checkbox" value="corn" name="toppings">Corn</label>
            <label class="checkbox"><input type="checkbox" value="mushrooms" name="toppings">Mushrooms</label>
        </div>
    </form>`;
        const order = document.querySelector('.container');
        order.innerHTML += form;

        appController.order.addPizza(new Pizza(['ham'], 'small'));
        appController.order.addPizza(new Pizza(['olives'], 'medium'));
        orderElem = document.createElement('div');
        orderElem.classList.add('order');
        document.body.appendChild(orderElem);
    });

    afterEach(() => {
        const order = document.querySelector('.container');
        const form = document.querySelector('form')
        form.parentNode.removeChild(form)
        orderElem.parentNode.removeChild(orderElem);
    });

    describe('renderOrder()', () => {

        it('should have correct bindings for pizza', () => {
            appController.renderPizzasInOrder();

            const pizza = orderElem.querySelectorAll('.pizza')[0];
            const size = pizza.querySelector('.size').textContent;
            const toppings = pizza.querySelector('.toppings').textContent;
            const price = pizza.querySelector('.price').textContent;

            expect(size).toBe('small');
            expect(toppings).toBe('ham');
            expect(price).toBe('0.5$');
        });

        it('should have correct number of pizzas in order', () => {
            appController.renderPizzasInOrder();
            expect(orderElem.querySelectorAll('.pizza').length).toBe(2);
        });

        it('should have correct message for no pizza', () => {
            appController.order.pizzas = [];
            appController.renderPizzasInOrder();

            expect(orderElem.textContent).toBe('No pizzas in order');
        });

        it('should invoke remove pizza from order', () => {
            window.appController = new AppController();
            const removePizzaSpy = spyOn(window.appController, 'removePizza');

            appController.renderPizzasInOrder();
            const removeButton = orderElem.querySelectorAll('.pizza')[0].querySelector('button');
            removeButton.click();

            expect(removePizzaSpy).toHaveBeenCalled();
        });

        it('should be called with other methods', () => {
            const spyPizzas = spyOn(appController, 'renderPizzasInOrder');
            const spyButton = spyOn(appController, 'renderAddPizzaButtonInOrder')
            const spyPrice = spyOn(appController, 'renderTotalPriceInOrder')

            appController.renderOrder()

            expect(spyPizzas.and.callThrough()).toHaveBeenCalled()
            expect(spyButton.and.callThrough()).toHaveBeenCalled()
            expect(spyPrice.and.callThrough()).toHaveBeenCalled()
        });

    });

    describe('init()', () => {
        it('should call init methods', async () => {
            const initOrderSpy = spyOn(appController, 'initOrder').and.returnValue(Promise.resolve());
            const renderOrderSpy = spyOn(appController, 'renderOrder');

            await appController.init();

            expect(initOrderSpy).toHaveBeenCalled();
            expect(renderOrderSpy).toHaveBeenCalled();
        });
    });

    describe('initOrder()', () => {
        const responseData = [
            {
                "toppings": ["ham", "bacon"],
                "size": "large"
            },
            {
                "toppings": ["corn", "olives"],
                "size": "medium"
            }
        ];

        it('should set pizzas to order', async (done) => {
            const requestSpy = spyOnProperty(appController, 'pizzas').and.returnValue(Promise.resolve(responseData));
            const addPizzaSpy = spyOn(appController.order, 'addPizza');

            await appController.initOrder();

            expect(requestSpy).toHaveBeenCalled();
            expect(addPizzaSpy).toHaveBeenCalledTimes(2);
            done();
        });
    });

    describe('renderPizzasInOrder', () => {

        it('should render an empty pizza', () => {
            appController.order.addPizza(new Pizza('', ''));
            appController.renderPizzasInOrder()

            expect(appController.order.pizzas[2].size).toBe('')
        })

    })
    describe('pizzas', () => {
        it('should create new fetch', () => {
            expect(appController.pizzas).toBeDefined();
        });
    });

    describe('renderTotalPriceInOrder()', () => {
        let orderElem;

        beforeEach(() => {
            orderElem = document.createElement('div');
            orderElem.classList.add('order');
            document.body.appendChild(orderElem);
        })

        afterEach(() => {
            orderElem.parentNode.removeChild(orderElem);
        })

        it('should return correct total price', async () => {
            appController.order.addPizza(new Pizza(['olives'], ['small']));
            appController.order.addPizza(new Pizza(['ham'], ['small']));
            const totalPrice = appController.order.totalPrice;

            expect(`Total Price: ${totalPrice}$`).toBe(`Total Price: 1.75$`);
        });
    });

    describe('renderAddPizzaButtonInOrder', () => {
        let orderElem;

        beforeEach(() => {
            appController.order.addPizza(new Pizza(['bacon', 'ham'], 'small'));
            appController.order.addPizza(new Pizza(['ham'], 'small'));

            orderElem = document.createElement('div');
            orderElem.classList.add('order');
            document.body.appendChild(orderElem);
        });

        afterEach(() => {
            orderElem.parentNode.removeChild(orderElem);

        });

        it('Should render add button for pizza', () => {
            appController.renderPizzasInOrder();
            appController.renderAddPizzaButtonInOrder();
            const button = orderElem.querySelector('button.button');

            expect(button).toBeDefined();
        })

    })

    describe('Tests form elements', () => {
        describe('handleForm', () => {
            it('should be called with other methods', () => {
                const spyReplace = spyOn(appController, 'replaceForm');
                const spyReset = spyOn(appController, 'resetFormElements')
                const spySetEl = spyOn(appController, 'setFormElements')
                const spySetHandl = spyOn(appController, 'setFormChangeHandlers')
                const spyShow = spyOn(appController, 'showForm')

                appController.handleForm();

                expect(spyReplace.and.callThrough()).toHaveBeenCalled()
                expect(spyReset.and.callThrough()).toHaveBeenCalled()
                expect(spySetEl.and.callThrough()).toHaveBeenCalled()
                expect(spySetHandl.and.callThrough()).toHaveBeenCalled()
                expect(spyShow.and.callThrough()).toHaveBeenCalled()

            });
        });

        describe('resetFormElements', () => {
            let orderElem;

            beforeEach(() => {
                orderElem = document.createElement('div');
                orderElem.classList.add('order');
                document.body.appendChild(orderElem);
            })

            afterEach(() => {
                orderElem.parentNode.removeChild(orderElem);
            })

            it('Should reset inputs in form', async () => {
                window.appController = new AppController();
                await window.appController.init();
                window.appController.renderOrder()

                const inputs = Array.from(document.querySelectorAll('.toppings input')).filter(input => input.checked);
                expect(inputs.length).toBe(0)
            });

            it('should call getFormElement method', () => {
                appController.resetFormElements();
                expect(appController.getFormElements()).toBeTruthy()
            })
        });

        describe('setFormElements', () => {
            let orderElem;

            it('Set elements', () => {

                const pizza = new Pizza(['bacon'], 'small');
                appController.setFormElements(pizza);

                const checkedToppings = document.querySelector('.pizza-editor input[value="bacon"]');
                const checkedSize = document.querySelectorAll('.pizza-editor input[value="small"]')[0];

                expect(checkedToppings.checked).toBeTrue()
                expect(checkedSize.checked).toBeTrue()
            })
        });

        describe('getFormElements', () => {

            it('Get Elements', () => {
                const order = document.querySelector('.container');
                const inputs = [...Array.from(order.querySelectorAll('input[type=radio]')),
                ...Array.from(order.querySelectorAll('input[type=checkbox]'))];
                const formInputs = appController.getFormElements();
                let { sizeRadio, toppingsCheckboxes } = formInputs;
                sizeRadio = Array.from(sizeRadio);
                toppingsCheckboxes = Array.from(toppingsCheckboxes);

                expect(inputs.length).toBe(sizeRadio.concat(toppingsCheckboxes).length)

            })
        });

        describe('hideForm', () => {

            it('should hide the form', () => {

                const formEditor = document.querySelector('.pizza-editor');
                formEditor.style.display = 'block';

                appController.hideForm();
                expect(formEditor.style.display).toBe('none');
            });
        });

        describe('showForm', () => {

            it('Should show the form', () => {

                const formEditor = document.querySelector('.pizza-editor');
                formEditor.style.display = 'none';

                appController.showForm();
                expect(formEditor.style.display).toBe('block');
            })
        })

        describe('setFormChangeHandlers', () => {

            it('should add listeners', () => {
                const spyRenderOrder = spyOn(appController, 'renderOrder');
                const selectedPizza = appController.order.pizzas[0];
                const inputElem = document.querySelector('.pizza-editor').querySelector('input');

                appController.setFormChangeHandlers(selectedPizza);
                inputElem.click();

                expect(spyRenderOrder).toHaveBeenCalled();
            });
        })

        describe('serializeForm', () => {
            it('should be called', () => {
                expect(appController.serializeForm()).toBeTruthy();
            });
        });

        describe('replaceForm', () => {

            it('replaceForm have been called', () => {
                const formEditor = document.querySelector('.pizza-editor');
                appController.replaceForm()
                expect(appController.replaceForm).toBeTruthy()

            });

        })
    })

    describe('addPizzaForm', () => {
        it('should be called with other methods', () => {
            const spyHandle = spyOn(appController, 'handleForm')
            const spyOrder = spyOn(appController, 'renderOrder')
            const spyShow = spyOn(appController, 'showForm')

            appController.addPizzaForm();

            expect(spyHandle.and.callThrough()).toHaveBeenCalled()
            expect(spyOrder.and.callThrough()).toHaveBeenCalled()
            expect(spyShow.and.callThrough()).toHaveBeenCalled()
        })
    })

    describe('removePizza', () => {
        it('should be called with other methods', () => {
            const spyOrder = spyOn(appController, 'renderOrder')
            const spyReplace = spyOn(appController, 'replaceForm')
            const spyHide = spyOn(appController, 'hideForm')

            appController.removePizza();

            expect(spyOrder).toHaveBeenCalled()
            expect(spyReplace).toHaveBeenCalled()
            expect(spyHide).toHaveBeenCalled()
        });
    });

});






































