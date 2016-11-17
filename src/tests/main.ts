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

context.defineDomainEvent<ITodoCreated>('todo:created');

/**
 * Register aggregates
 */

class Todo extends Aggregate implements IAggregate {

  constructor () {
    super();
  }

  create (info: {title: string}) {
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
    this.$aggregate.create('Todo', {title: this._data.title})
      .then(todo => {
        todo;
      });
    return Promise.resolve();
  }
}

context.registerCommand<CreateTodo>('createTodo', CreateTodo);

/**
 * Tests.
 */

context.command('createTodo', {title: 'asd'});
