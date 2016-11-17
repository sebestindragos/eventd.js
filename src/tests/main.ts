import {Context} from '../core/context';
import {Aggregate} from '../core/aggregate';
import {IAggregate} from '../core/IAggregate';
import {Command, ICommand} from '../core/command';

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

context.defineDomainEvent<ITodoCreated>('todo:created');
context.defineDomainEvent<ITodoUpdated>('todo:updated');

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

    this.emitDomainEvent<ITodoCreated>('todo:created', {title: info.title});
  }

  update (info: {title: string}) {
    if (!info || !info.title)
      throw new Error ('title is missing');

    this.emitDomainEvent<ITodoUpdated>('todo:updated', {title: info.title});
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


// --------------------------------------------------------------------------------------------------------------
/**
 * Tests.
 */

context.command('createTodo', {title: 'asd'})
  .then(todoId => context.command('updateTodo', {title: 'bla'}))
  .then(() => console.log('done'))
  .catch(err => console.error(err));
