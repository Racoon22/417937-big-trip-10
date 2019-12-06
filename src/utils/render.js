export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREBEGIN: `beforebegin`
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element.getElement());
      break;
    default:
      container.append(element.getElement());
  }
};

export const remove = (component) => {
  component.getElement().remove();
};

export const replace = (newComponent, oldComponent) => {
  const parent = oldComponent.getElement().parentElement;
  const newElement = newComponent.getElement();
  const oldElement = oldComponent.getElement();

  const isExistsElements = !!(parent && newElement && oldElement);

  if (isExistsElements && parent.contains(oldElement)) {
    parent.replaceChild(newElement, oldElement);
  }
};
