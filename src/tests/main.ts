import * as uuid from 'node-uuid';

import {EVENTS} from './events';
import {IEvent, Event} from '../lib/event';
import {AggregateRoot} from '../lib/aggregateRoot';
import {ICommand, Command} from '../lib/command';
import {ICommandHandler} from '../lib/ICommandHandler';
import {MemoryRepository} from './memoryRepository';
import {MemoryEventBus} from './memoryEventBus';
import {EventStore} from '../lib/eventStore';
import {LocalContext} from '../lib/context';

/**
 * Define events
 */
interface ITodoCreated {
  title: string,
  checked: boolean
}

class TodoCreated extends Event<ITodoCreated> {

  constructor (aggregateId: string, version: number, payload: ITodoCreated) {
    super(aggregateId, EVENTS.todoCreated, version, payload);
  }
}

interface ITodoTitleChanged {
  title: string
}

class TodoTitleChanged extends Event<ITodoTitleChanged> {

  constructor (aggregateId: string, version: number, payload: ITodoTitleChanged) {
    super(aggregateId, EVENTS.todoCreated, version, payload);
  }
}

interface ITodoResolved {
}

class TodoResolved extends Event<ITodoResolved> {

  constructor (aggregateId: string, version: number, payload: ITodoResolved) {
    super(aggregateId, EVENTS.todoCreated, version, payload);
  }
}

/**
 * Define aggregates
 */
class Todo extends AggregateRoot {
  private _title: string;
  private _checked: boolean;

  constructor (todoId: string, payload?: ITodoCreated) {
    super(todoId);

    if (payload)
      this.applyChange(new TodoCreated(super.id, super.getNextVersion(), payload));
  }

  changeTitle (newTitle: string) {
    this.applyChange(new TodoTitleChanged(super.id, super.getNextVersion(), {title: newTitle}));
  }

  [EVENTS.todoCreated] (event: IEvent<ITodoCreated>) {
    this._title = event.payload.title;
    this._checked = event.payload.checked;
  }

  [EVENTS.todoTitleChanged] (event: IEvent<ITodoTitleChanged>) {
    this._title = event.payload.title;
  }
}

/**
 * Define commands and handlers.
 */
interface ICreateTodo {
  title: string
}
type CreateTodo = ICommand <ICreateTodo>;
class CreateTodoHandler implements ICommandHandler<ICreateTodo> {
  constructor (private _eventStore: EventStore) { }

  async execute (cmd: CreateTodo) : Promise<void> {
    let todo = new Todo(cmd.aggregateId, {
      title: cmd.payload.title,
      checked: false
    });

    this._eventStore.save(todo);
  }
}

interface IChangeTodoTitle {
  title: string
}
type ChangeTodoTitle = ICommand <ICreateTodo>;
class ChangeTodoTitleHandler implements ICommandHandler<IChangeTodoTitle> {
  constructor (private _eventStore: EventStore) { }

  async execute (cmd: ChangeTodoTitle) : Promise<void> {
    let todo = new Todo(cmd.aggregateId);
    await this._eventStore.rehydrate(todo);

    todo.changeTitle(cmd.payload.title);

    this._eventStore.save(todo);
  }
}

// --------------------------------------------------------------------------------------------------------------
/**
 * Tests.
 */
async function runTests () {
  let context = new LocalContext('Todos');
  let eventStream = new MemoryEventBus();
  let eventStore = new EventStore(eventStream, new MemoryRepository());

  context.registerCommandHandler('CreateTodo', new CreateTodoHandler(eventStore));
  context.registerCommandHandler('ChangeTodoTitle', new ChangeTodoTitleHandler(eventStore));

  eventStream.register(event => {
    console.log(event);
  });

  try {
    let newTodoId = uuid.v1();

    await context.command('CreateTodo', new Command<ICreateTodo>(newTodoId, {title: 'finish project'}));
    await context.command('ChangeTodoTitle', new Command<IChangeTodoTitle>(newTodoId, {
      title: 'finish project sometime this year ...'
    }));

  } catch (ex) {
    console.trace(ex);
  }
}

runTests();
