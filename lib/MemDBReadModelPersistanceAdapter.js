/**
 * ReadModelPersistanceAdapter is needed to separate persistance logic from read model state logic.
 * It is quite trivial to change persistance type (sql, nosql, graph database or key/value store for example)
 * just by assigning a new persistance adapter to an existing read model.
 * 
 * In this case MemDB and MemDBReadModelPersistanceAdapter have indentical interface for insert, update, remove and get methods
 * to keep this example simple and clean as possible, but writing an adapter for any sql database (or any other db type) would be
 * easy.
 * 
 * For example MongoDB adapter would need to implement insert method like this:
 * 
 * function insert (collection, key, record) {
 *   record["_id"] = key
 *   mongoDB.collection(collection).insert(record)
 * }
 */

/**
 * Initialize ReadModelPersistanceAdapter for MemDB
 * 
 * @param {MemDB} memDB 
 * @returns {ReadModelPersistanceAdapter}
 */
function MemDBReadModelPersistanceAdapter (memDB) {
  /**
   * Insert item into collection
   * 
   * @param {any} collection Collection name
   * @param {any} key Item key
   * @param {any} record Item data
   */
  function insert (collection, key, record) {
    memDB.insert(collection, key, record)
  }

  /**
   * Get item data
   * 
   * @param {String} collection Collection name of item to get
   * @param {String} key Item key 
   * @returns {Object} Item data (false if item is not found)
   */
  function get (collection, key) {
    return memDB.get(collection, key)
  }

  /**
   * Update an item
   * 
   * @param {String} collection Collection name of item to update
   * @param {String} key Item key
   * @param {Object} record New data to update
   */
  function update (collection, key, record) {
    memDB.update(collection, key, record)
  }

  /**
   * Delete an item
   * @param {String} collection Collection name to delete item from
   * @param {String} key Item key
   */
  function remove (collection, key) {
    memDB.remove(collection, key)
  }

  /**
   * List all items for requested collection
   * 
   * @param {String} collection 
   * @returns {Array} Matched items array
   */
  function list (collection) {
    return memDB.list(collection)
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
    return memDB.find(collection, property, value)
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

export default MemDBReadModelPersistanceAdapter