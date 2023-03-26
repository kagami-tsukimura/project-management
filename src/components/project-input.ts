import { Component } from './base-component';
import * as Validation from '../util/validation';
import { autobind } from '../decorators/autobind';
import { projectState } from '../state/project-state';

// ProjectInput Class
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  mandayInputElement: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, 'user-input');

    this.titleInputElement = this.element.querySelector(
      '#title'
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      '#description'
    ) as HTMLInputElement;
    this.mandayInputElement = this.element.querySelector(
      '#manday'
    ) as HTMLInputElement;

    this.configure();
  }

  configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  renderContent() {}

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredManday = this.mandayInputElement.valueAsNumber;

    const titleValidatable: Validation.Validatable = {
      value: enteredTitle,
      required: true,
    };
    const descriptionValidatable: Validation.Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };
    const mandayValidatable: Validation.Validatable = {
      value: enteredManday,
      required: true,
      min: 1,
      max: 1000,
    };
    const isInputsValid =
      Validation.validate(titleValidatable) &&
      Validation.validate(descriptionValidatable) &&
      Validation.validate(mandayValidatable);

    if (isInputsValid) {
      return [enteredTitle, enteredDescription, enteredManday];
    } else {
      const TITLE_ERROR = '・The title is a required input.\n';
      const DESC_ERROR =
        '・Description is a required input of 5 or more characters.\n';
      const MANDAY_ERROR =
        '・Manday is a required input of between 1 and 1000.\n';
      const errorMessage = `${
        !Validation.validate(titleValidatable) ? TITLE_ERROR : ''
      }${!Validation.validate(descriptionValidatable) ? DESC_ERROR : ''}${
        !Validation.validate(mandayValidatable) ? MANDAY_ERROR : ''
      }`;

      alert(`The input value is incorrect. Please try again.\n${errorMessage}`);
      return;
    }
  }

  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.mandayInputElement.value = '';
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, manday] = userInput;
      projectState.addProject(title, desc, manday);
      this.clearInputs();
    }
  }
}
