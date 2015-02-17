// This module exports a constructor function with a parameter for configuration.
// The 'config' parameter will hold an object instance containing all configuration
// values defined for this connector.
module.exports = function (config) {

    // config validation
    if (!config) throw new Error("'config' object is missing.");

    if (typeof(config.maxSize) !== 'number' || config.maxSize < 0) {
        throw new Error("configuration.maxSize must be a positive number.");
    }
    // instance variables initialization
    var maxSize = config.maxSize || Number.MAX_VALUE;
    var stack = [];

    // KidoZen will be able to invoke only public methods, so we define the methods
    // 'push' and 'pop' as public

    // Adds an element at the top of the stack.
    // Parameters:
    // - options : [Required] object instance containing the property 'data' that
    //                        represents the element to be added.
    // - callback : [Required] function instance.
    //
    // Returns : The method returns the number of elements present in the stack after
    //           the new element was added, or an Error instance if the 'options'
    //           argument is invalid or the max size of the stack was reached
    this.push = function (options, callback) {

        // options parameter validation
        if (!options) {
            callback(new Error("'options' is missing."));
            return;
        }
        // data parameter validation
        if (typeof options.data === undefined) {
            callback(new Error("options.data is missing."));
            return;
        }
        // stack size validation
        if (stack.length >= maxSize) {
            callback(new Error("The max size of the stack (" + maxSize + ") was reached."));
            return;
        }

        // adds the element to the top of the stack
        stack.push(options.data);

        // returns no error, and the current count of elements
        callback(null, stack.length);
    };

    // Removes an element from the top of the stack and returns it.
    // Parameters:
    // - options : [This parameter is not required but its declaration is needed in order
    //             to meet the requirements ]
    // - callback : [Required] function instance.
    //
    // Returns: The element that was at the top of the stack or an Error instance if the
    //          stack was empty.
    this.pop = function (options, callback) {
        // validates stack is not empty
        if (stack.length === 0) {
            callback(new Error("The stack is empty."));
            return;
        }
        // returns no error and the element that was at the top.
        callback(null, stack.pop());
    };
};