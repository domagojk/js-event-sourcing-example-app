/**
 * Initialize MemDB
 * This is a very simple memory db implementation to use with read models in this example application.
 * In real life situation we would probably use a database of choice instead of writing our own.
 */
function MemDB () {
  const data = new Map()

  /**
   * Insert item into collection
   * 
   * @param {any} collection Collection name
   * @param {any} key Item key
   * @param {any} record Item data
   */
  function insert (collection, key, record) {
    if (!data.has(collection)) {
      data.set(collection, new Map())
    }
    //  embed key in value object
    const value = Object.assign({}, record, {_key: key})
    data.get(collection).set(key, value)
  }

  /**
   * Get item data
   * 
   * @param {String} collection Collection name of item to get
   * @param {String} key Item key 
   * @returns {Object} Item data (false if item is not found)
   */
  function get (collection, key) {
    if (!data.has(collection)) {
      return false
    }
    return data.get(collection).get(key)
  }

  /**
   * Update an item
   * 
   * @param {String} collection Collection name of item to update
   * @param {String} key Item key
   * @param {Object} record New data to update
   */
  function update (collection, key, record) {
    if (!data.has(collection)) {
      throw new Error('item does not exist')
    }
    if (!data.get(collection).has(key)) {
      throw new Error('item does not exist')
    }
    //  embed key in value object
    const value = Object.assign({}, record, {_key: key})
    data.get(collection).set(key, value)
  }

  /**
   * Delete an item
   * @param {String} collection Collection name to delete item from
   * @param {String} key Item key
   */
  function remove (collection, key) {
    if (!data.has(collection)) {
      throw new Error('item does not exist')
    }
    if (!data.get(collection).has(key)) {
      throw new Error('item does not exist')
    }
    data.get(collection).delete(key)
  }

  /**
   * List all items for requested collection
   * 
   * @param {String} collection 
   * @returns {Array} Matched items array
   */
  function list (collection) {
    if (!data.has(collection)) {
      return new Set()
    }
    return [...data.get(collection)].map(item => item[1])
  }

  /**
   * Find all items for collection that match requested property
   * 
   * @param {String} collection Collection name to search in
   * @param {String} property Property name to match
   * @param {String} value Property value to match
   * @returns {Array} Matched items array
   */
  function find (collection, property, value) {
    if (!data.has(collection)) {
      return []
    }
    return list(collection).filter(item => item[property] == value)
  }

  return {
    insert,
    update,
    remove,
    get,
    list,
    find
  }
}

export default MemDB