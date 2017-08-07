type Binding = { source: any, element: HTMLElement };
export type BindTarget =
    "value"  |
    "text"   |
    "html"   |
    "checked";

const bindings: Binding[] = [];

function findBinding(bindingSource: any): Binding | null {
    if (!bindingSource) {
        return null;
    }
    
    for (let i = 0; i < bindings.length; ++i) {
        let { source } = bindings[i];

        // TODO: optional custom equality
        if (bindingSource === source) {
            return bindings[i];
        }
    }

    return null;
}

function getDefaultBindTarget(element: Element): BindTarget{
    if (element instanceof HTMLInputElement) {
        const type = element.type;
        if (type === "text") {
            return "value";
        } else {
            return "checked";
        }
    } else {
        return "text";
    }
}

// property decorator
// designate a data source for one-way binding
function oneWay(selector: string, bindTarget?: BindTarget): MethodDecorator {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
        const { get, set } = descriptor;

        if (!get || !set) {
            console.error("bound accessor must have both get and set methods");
            return;
        }

        descriptor.set = function bindingSetter(v: any) {
            const binding = findBinding(this);
            const initialValue = binding ? get.call(this) : undefined;

            set.call(this, v);

            if (binding && v !== initialValue) {
                const boundElement = binding.element.querySelector(selector);

                if (boundElement) {
                    if (!bindTarget) {
                        bindTarget = getDefaultBindTarget(boundElement);
                    }
                    
                    boundElement.setAttribute(bindTarget, v);
                } else {
                    console.warn(`Couldn't find bind target ${selector} on root`, binding.element);
                }
            }
        }
    }
}

// property decorator
// designate a data source for two-way binding
function twoWay(selector: string): MethodDecorator {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
        throw new Error("two-way binding is not implemented");
    }
}

// TODO: make sure binding doesn't already exist
function bind(source: any, element: HTMLElement) {
    var binding = { source, element };

    bindings.push(binding);
}

function unbind(source: any, element: HTMLElement) {

}

export {
    oneWay,
    twoWay,
    bind,
    unbind
};