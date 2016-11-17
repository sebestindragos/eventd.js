import {EVENTS} from './events';

import {Context} from '../core/context';
import {Aggregate} from '../core/aggregate';
import {IAggregate} from '../core/IAggregate';
import {Command, ICommand} from '../core/command';
import {Projection} from '../core/projection';
import {DomainEvent} from '../lib/domainEvent';

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

  create (info: {title: string}) {
    if (!info || !info.title)
      throw new Error ('title is missing');

    this.emitDomainEvent<ITodoCreated>(EVENTS.todoCreated, {title: info.title});
  }

  update (info: {title: string}) {
    if (!info || !info.title)
      throw new Error ('title is missing');

    this.emitDomainEvent<ITodoUpdated>(EVENTS.todoUpdated, {title: info.title});
  }
}

context.registerAggregate<Todo>('Todo', Todo);

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

context.registerCommand<CreateTodo>('createTodo', CreateTodo);
context.registerCommand<UpdateTodo>('updateTodo', UpdateTodo);

/**
 * Register projections.
 */
let todos = new Map<string, any>();

class Todos extends Projection {
  constructor () {
    super();
  }

  [EVENTS.todoCreated] (event: DomainEvent<ITodoCreated>) {
    todos.set(event._aggregateId, event._payload);
  }

  [EVENTS.todoUpdated] (event: DomainEvent<ITodoUpdated>) {
    console.log(event);
    todos.get(event._aggregateId).title = event._payload.title;
  }
}

context.registerProjection(Todos);

// --------------------------------------------------------------------------------------------------------------
/**
 * Tests.
 */

context.command('createTodo', {title: 'asd'})
  .then(todoId => context.command('updateTodo', {todoId: todoId, title: 'bla'}))
  .then(() => console.log('done', todos))
  .catch(err => console.error(err));
