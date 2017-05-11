import MemDB from './MemDB'

const TEST_COLLECTION = 'TEST_COLLECTION'

const TEST_ITEM_1_KEY = 'TEST_ITEM_1'

const TEST_ITEM_1_DATA_INITIAL = {
  name: 'John Doe',
  city: 'DeveloperVille'
}

const TEST_ITEM_1_DATA_INITIAL_CHECK = {
  _key: TEST_ITEM_1_KEY,
  name: 'John Doe',
  city: 'DeveloperVille'
}

const TEST_ITEM_2_KEY = 'TEST_ITEM_2'

const TEST_ITEM_2_DATA_INITIAL = {
  name: 'Adam Smith',
  city: 'DeveloperVille'
}

const TEST_ITEM_2_DATA_INITIAL_CHECK = {
  _key: TEST_ITEM_2_KEY,
  name: 'Adam Smith',
  city: 'DeveloperVille'
}

const TEST_ITEM_2_DATA_UPDATE = {
  name: 'Adam Smith #2',
  city: 'DeveloperVille #2'
}

const TEST_ITEM_2_DATA_UPDATE_CHECK = {
  _key: TEST_ITEM_2_KEY,
  name: 'Adam Smith #2',
  city: 'DeveloperVille #2'
}

it('should insert item #1 to collection', () => {
  MemDB.insert(TEST_COLLECTION, TEST_ITEM_1_KEY, TEST_ITEM_1_DATA_INITIAL)
})

it('should get item #1 from collection', () => {
  const item = MemDB.get(TEST_COLLECTION, TEST_ITEM_1_KEY)
  expect(item).toEqual(TEST_ITEM_1_DATA_INITIAL_CHECK)
})

it('should insert item #2 to collection', () => {
  MemDB.insert(TEST_COLLECTION, TEST_ITEM_2_KEY, TEST_ITEM_2_DATA_INITIAL)
})

it('should get item #2 from collection', () => {
  const item = MemDB.get(TEST_COLLECTION, TEST_ITEM_1_KEY)
  expect(item).toEqual(TEST_ITEM_1_DATA_INITIAL_CHECK)
})

it('should get both items from collection', () => {
  const items = MemDB.list(TEST_COLLECTION)
  expect(items).toContainEqual(TEST_ITEM_1_DATA_INITIAL_CHECK)
  expect(items).toContainEqual(TEST_ITEM_2_DATA_INITIAL_CHECK)
})

it('should remove item #1 from collection', () => {
  MemDB.remove(TEST_COLLECTION, TEST_ITEM_1_KEY)
})

it('should get only item #2 from collection', () => {
  const items = MemDB.list(TEST_COLLECTION)
  expect(items).toHaveLength(1)
  expect(items).toContainEqual(TEST_ITEM_2_DATA_INITIAL_CHECK)
})

it('should update item #2', () => {
  MemDB.update(TEST_COLLECTION, TEST_ITEM_2_KEY, TEST_ITEM_2_DATA_UPDATE)
})

it('should match item #2 with updated data', () => {
  const item = MemDB.get(TEST_COLLECTION, TEST_ITEM_2_KEY)
  expect(item).toEqual(TEST_ITEM_2_DATA_UPDATE_CHECK)
})

it('should insert item #1 again', () => {
  const item = MemDB.insert(TEST_COLLECTION, TEST_ITEM_1_KEY, TEST_ITEM_1_DATA_INITIAL)
})

it('should find only item #2 from collection', () => {
  const items = MemDB.find(TEST_COLLECTION, 'name', 'Adam Smith #2')
  expect(items).toHaveLength(1)
  expect(items).toContainEqual(TEST_ITEM_2_DATA_UPDATE_CHECK)
})