import {EVENTS} from './events';

import {Context} from '../core/context';
import {IAggregate, Aggregate} from '../core/aggregate';
import {Command, ICommand} from '../core/command';
import {Projection} from '../core/projection';
import {DomainEvent} from '../core/domainEvent';
import {IQuery, Query} from '../core/query';

let context = new Context();

/**
 * Define domain events
 */
interface ITodoCreated {
  title: string
}
interface ITodoUpdated {
  title: string
}

context.defineDomainEvent<ITodoCreated>(EVENTS.todoCreated);
context.defineDomainEvent<ITodoUpdated>(EVENTS.todoUpdated);

/**
 * Register aggregates
 */

class Todo extends Aggregate implements IAggregate {

  constructor () {
    super();
  }

  create (info: {title: string}) : Promise<void> {
    if (!info || !info.title)
      throw new Error ('title is missing');

    this.emitDomainEvent<ITodoCreated>(EVENTS.todoCreated, {title: info.title});
    return Promise.resolve();
  }

  update (info: {title: string}) {
    if (!info || !info.title)
      throw new Error ('title is missing');

    this.emitDomainEvent<ITodoUpdated>(EVENTS.todoUpdated, {title: info.title});
  }
}

context.registerAggregate(Todo);

/**
 * Regiser commands.
 */

class CreateTodo extends Command implements ICommand {
  constructor (private _data: {title: string}) {
    super();
  }
  execute () : Promise<any> {
    return new Promise<string>((resolve, reject) => {
      this.$aggregate.create('Todo', {title: this._data.title})
        .then(todoId => resolve(todoId))
        .catch(err => reject(err));
    });
  }
}
class UpdateTodo extends Command implements ICommand {
  constructor (private _data: {todoId: string, title: string}) {
    super();

    if (!_data.todoId)
      throw new Error('no id provided');
  }
  execute () : Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.$aggregate.load('Todo', this._data.todoId)
        .then((todo: Todo) => {
          todo.update({title: this._data.title});
          resolve();
        })
        .catch(err => reject(err));
    });
  }
}

context.registerCommand(CreateTodo);
context.registerCommand(UpdateTodo);

/**
 * Register projections.
 */
interface ITodo {
  title: string
}
let todos = new Map<string, ITodo>();

class Todos extends Projection {
  constructor () {
    super();
  }

  [EVENTS.todoCreated] (event: DomainEvent<ITodoCreated>) {
    todos.set(event._aggregateId, event._payload);
  }

  [EVENTS.todoUpdated] (event: DomainEvent<ITodoUpdated>) {
    todos.get(event._aggregateId).title = event._payload.title;
  }
}

context.registerProjection(Todos);

/**
 * Register queries.
 */
class GetTodos extends Query implements IQuery<ITodo[]> {

  execute () : Promise<ITodo[]> {
    return Promise.resolve<ITodo[]>(Array.from(todos.values()));
  }
}

context.registerQuery(GetTodos);

// --------------------------------------------------------------------------------------------------------------
/**
 * Tests.
 */

context.command('CreateTodo', {title: 'asd'})
  .then(todoId => context.command('UpdateTodo', {todoId: todoId, title: 'bla'}))
  .then(() => context.query('GetTodos'))
  .then(todos => console.log('done', todos))
  .catch(err => console.error(err));
