import assert from 'assert';

import Product from './product.js';
import Service from './service.js';

const callTracker = new assert.CallTracker();

process.on('exit', () => callTracker.verify());

// should throw an error when description is less than 5 characters long
{
  const params = {
    description: 'meu',
    id: 1,
    price: 1000
  };

  const product = new Product({
    onCreate: () => {},
    service:  new Service()
  });

  assert.rejects(
  () => product.create(params),
  { message: 'description must be higher than 5' },
  'it should throw an error with worng description'
  );
}

// should save product successfully
{
  const params = {
    description: 'meu produto',
    id: 1,
    price: 1000
  };

  const spy = callTracker.calls(1);
  const serviceStub = {
    async save(params){
      spy(params);

      return 'ok'
    }
  };

  const fn = (msg) => {
    assert.deepStrictEqual(msg.id,          params.id,                        'id should be the same');
    assert.deepStrictEqual(msg.price,       params.price,                     'price should be the same');
    assert.deepStrictEqual(msg.description, params.description.toUpperCase(), 'description should be the same');
  }

  const spyOnCreate = callTracker.calls(fn, 1);

  const onCreate = (msg) => {
    spyOnCreate(msg);
  };
  const product = new Product({
    onCreate: onCreate,
    service:  serviceStub
  });

  const result = await product.create(params);

  assert.deepStrictEqual(result, 'OK');
}

