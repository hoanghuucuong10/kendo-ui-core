(function($, undefined) {
    /**
     * @name kendo.ui.ComboBox.Description
     *
     * @section
     * <p>
     * The <strong>ComboBox</strong> displays a list of values and allows the selection of a single value from this
     * list. Custom values may also be entered via keyboard input. If you do not wish permit keyboard input - that is,
     * custom values are not permitted - use the
     * <strong>DropDownList</strong>.
     * </p>
     * <p>
     * The <strong>ComboBox</strong> represents a richer version of a &lt;select&gt; element, providing support for
     * local and remote data binding, item templates, and configurable options for controlling the list behavior.
     * </p>
     * <h3>Getting Started</h3>
     * <p>There are two ways to create a <strong>ComboBox</strong>:</p>
     * <ol>
     *  <li>From a &lt;select&gt; element with HTML to define the list items</li>
     *  <li>From an &lt;input&gt; element with databinding to define the listitems</li>
     * </ol>
     * <p>
     *  A <strong>ComboBox</strong> will look and operate consistently regardless of the way in which it was created.
     * </p>
     *
     * @exampleTitle Creating a ComboBox from an existing &lt;input&gt; element
     * @example
     * <input id="comboBox" />
     *
     * @section
     * <p></p>
     * <p>
     *  Initialization of a <strong>ComboBox</strong> should occur after the DOM is fully loaded. It is recommended
     *  that initialization the <strong>ComboBox</strong> occur within a handler is provided to
     *  $(document).ready().
     * </p>
     *
     * @exampleTitle Initialize a ComboBox using a selector within $(document).ready()
     * @example
     * $(document).ready(function(){
     *     $("#comboBox").kendoComboBox({
     *         dataTextField: "text",
     *         dataValueField: "value",
     *         dataSource: [
     *             { text: "Item1", value: "1" },
     *             { text: "Item2", value: "2" }
     *         ]
     *     });
     * });
     *
     * @exampleTitle Creating a ComboBox from existing &lt;select&gt; element with a pre-defined structure
     * @example
     * <select id="comboBox">
     *     <option>Item 1</option>
     *     <option>Item 2</option>
     *     <option>Item 3</option>
     * </select>
     *
     * <script>
     *     $(document).ready(function(){
     *         $("#comboBox").kendoComboBox();
     *     });
     * </script>
     *
     * @section
     * <h3>Binding to Local or Remote Data</h3>
     * <p>
     *  The <strong>ComboBox</strong> can be bound to both local arrays and remote data via the
     *  <strong>DataSource</strong> component; an abstraction for local and
     *  remote data. Local arrays are appropriate for limited value options, while remote data binding is better for
     *  larger data sets. With remote data-binding, items will be loaded on-demand; when they are displayed.
     * </p>
     *
     * @exampleTitle Binding to a remote OData service
     * @example
     * $(document).ready(function() {
     *     $("#comboBox").kendoComboBox({
     *         index: 0,
     *         dataTextField: "Name",
     *         dataValueField: "Id",
     *         filter: "contains",
     *         dataSource: {
     *             type: "odata",
     *             serverFiltering: true,
     *             serverPaging: true,
     *             pageSize: 20,
     *             transport: {
     *                 read: "http://odata.netflix.com/Catalog/Titles"
     *             }
     *         }
     *     });
     * });
     *
     * @section
     * <h3>Customizing Item Templates</h3>
     * <p>
     *  The <strong>ComboBox</strong> uses Kendo UI templates to enable you to control how items are rendered. For a
     *  detailed description of the capabilities and syntax of the Kendo UI templates, please refer to the
     *  <a href="http://www.kendoui.com/documentation/framework/templates/overview.aspx" title="Kendo UI Template">documentation</a>.
     * </p>
     *
     * @exampleTitle Basic item template customization
     * @example
     * <input id="comboBox" />
     * <!-- Template -->
     * <script id="scriptTemplate" type="text/x-kendo-template">
     *     # if (data.BoxArt.SmallUrl) { #
     *         <img src="${ data.BoxArt.SmallUrl }" alt="${ data.Name }" />
     *         Title:${ data.Name }, Year: ${ data.Name }
     *     # } else { #
     *         <img alt="${ data.Name }" />
     *         Title:${ data.Name }, Year: ${ data.Name }
     *     # } #
     * </script>
     *
     * <!-- ComboBox initialization -->
     * <script>
     *     $(document).ready(function() {
     *         $("#comboBox").kendoComboBox({
     *             autoBind: false,
     *             dataTextField: "Name",
     *             dataValueField: "Id",
     *             template: $("#scriptTemplate").html(),
     *             dataSource: {
     *                 type: "odata",
     *                 serverFiltering: true,
     *                 serverPaging: true,
     *                 pageSize: 20,
     *                 transport: {
     *                     read: "http://odata.netflix.com/Catalog/Titles"
     *                 }
     *             }
     *         });
     *     });
     * </script>
     *
     * @section
     * <h3>Accessing an Existing ComboBox</h3>
     * <p>
     *  You can reference an existing <b>ComboBox</b> instance via
     *  <a href="http://api.jquery.com/jQuery.data/">jQuery.data()</a>. Objectnce a reference has been established, you
     *  can use the API to control its behavior.
     * </p>
     *
     * @exampleTitle Accessing an existing ComboBox instance
     * @example
     * var comboBox = $("#comboBox").data("kendoComboBox");
     *
     */
    var kendo = window.kendo,
        ui = kendo.ui,
        List = ui.List,
        Select = ui.Select,
        support = kendo.support,
        placeholderSupported = support.placeholder,
        removeFiltersForField = Select.removeFiltersForField,
        keys = kendo.keys,
        CLICK = support.touch ? "touchend" : "click",
        ATTRIBUTE = "disabled",
        CHANGE = "change",
        DEFAULT = "k-state-default",
        DISABLED = "k-state-disabled",
        FOCUSED = "k-state-focused",
        MOUSEDOWN = "mousedown",
        SELECT = "select",
        STATE_SELECTED = "k-state-selected",
        STATE_FILTER = "filter",
        STATE_ACCEPT = "accept",
        STATE_REBIND = "rebind",
        HOVEREVENTS = "mouseenter mouseleave",
        NULL = null,
        proxy = $.proxy;

    var ComboBox = Select.extend(/** @lends kendo.ui.ComboBox.prototype */{
        /**
        * @constructs
        * @extends kendo.ui.Select
        * @param {DomElement} element DOM element
        * @param {Object} options Configuration options.
        * @option {Object | kendo.data.DataSource} [dataSource] A local JavaScript object or instance of DataSource or the data that the ComboBox will be bound to.
        * _example
        * var items = [{ text: "Item 1", value: "1" }, { text: "Item 2", value: "2" }];
        * $("#comboBox").kendoComboBox({
        *     dataTextField: "text",
        *     dataValueField: "value",
        *     dataSource: items
        * });
        * _exampleTitle To set after initialization
        * _example
        * $("#comboBox").kendoComboBox({
        *     dataSource: new kendo.data.DataSource({
        *         transport: {
        *             read: {
        *                 url: "Get/Items" // url to remote data source (simple list of strings)
        *             }
        *         }
        *     });
        * });
        * @option {Boolean} [enable] <true> Controls whether the ComboBox should be initially enabled.
        * _example
        * $("#comboBox").kendoComboBox({
        *     enable: false
        * });
        * _exampleTitle To set after initialization
        * _example
        * // get a reference to the ComboBox widget
        * var comboBox = $("#comboBox").data("kendoComboBox");
        * comboBox.enable(false);
        * @option {Number} [index] <-1> Defines the initial selected item.
        * _example
        * var items = [{ text: "Item 1", value: "1" }, { text: "Item 2", value: "2" }];
        * $("#comboBox").kendoComboBox({
        *     dataSource: items,
        *     index: 1 // 0 based from the start of the collection of objects. this selects "Item 2".
        * });
        * @option {Boolean} [autoBind] <true> Controls whether to bind the widget to the DataSource on initialization.
        * _example
        * $("#comboBox").kendoComboBox({
        *     autoBind: false
        * });
        * @option {Boolean} [highlightFirst] <true> Controls whether the first item will be automatically highlighted.
        * _example
        * $("#comboBox").kendoComboBox({
        *     highLightFirst: true
        * });
        * @option {Boolean} [suggest] <false> Controls whether the ComboBox should automatically auto-type the rest of text.
        * _example
        * $("#comboBox").kendoComboBox({
        *     suggest: false
        * });
        * @option {Number} [delay] <200> Specifies the delay in ms after which the ComboBox will start filtering dataSource.
        * _example
        * $("#comboBox").kendoComboBox({
        *     delay: 500
        * });
        * @option {Number} [minLength] <1> Specifies the minimum characters that should be typed before the ComboBox activates
        * _example
        * $("#comboBox").kendoComboBox({
        *     minLength: 3
        * });
        * @option {String} [dataTextField] <""> Sets the field of the data item that provides the text content of the list items.
        * _example
        * $("#comboBox").kendoComboBox({
        *     dataTextField: "Name",
        *     dataValueField: "ID"
        * });
        * @option {String} [dataValueField] <""> Sets the field of the data item that provides the value content of the list items.
        * _example
        * $("#comboBox").kendoComboBox({
        *     dataTextField: "Name",
        *     dataValueField: "ID"
        * });
        * @option {String} [filter] <"none"> Defines the type of filtration. If "none" the ComboBox will not filter the items.
        * _example
        * $("#comboBox").kendoComboBox({
        *     filter: "startswith"
        * });
        * @option {String} [ignoreCase] <true> Defines whether the filtration should be case sensitive.
        * _example
        * $("#combobox").kendoComboBox({
        *     filter: 'contains',
        *     ignoreCase: false //now filtration will be case sensitive
        * });
        * @option {Number} [height] <200> Define the height of the drop-down list in pixels.
        * _example
        * $("#comboBox").kendoComboBox({
        *     height: 500
        * });
        * @option {string} [template] Template to be used for rendering the items in the list.
        * _example
        *  //template
        * <script id="template" type="text/x-kendo-tmpl">
        *       # if (data.BoxArt.SmallUrl) { #
        *           <img src="${ data.BoxArt.SmallUrl }" alt="${ data.Name }" />Title:${ data.Name }, Year: ${ data.Name }
        *       # } else { #
        *           <img alt="${ data.Name }" />Title:${ data.Name }, Year: ${ data.Name }
        *       # } #
        *  </script>
        *
        *  //combobox initialization
        *  <script>
        *      $("#combobox").kendoComboBox({
        *          dataSource: dataSource,
        *          dataTextField: "Name",
        *          dataValueField: "Id",
        *          template: kendo.template($("#template").html())
        *      });
        *  </script>
        * @option {Object} [animation] <> Animations to be used for opening/closing the popup. Setting to false will turn off the animation.
        * _exampleTitle Turn of animation
        * _example
        * $("#comboBox").kendoComboBox({
        *     animation: false
        * });
        * @option {Object} [animation.open] <> Animation to be used for opening of the popup.
        * _example
        *  //combobox initialization
        *
        * <script>
        *      $("#combobox").kendoComboBox({
        *          dataSource: dataSource,
        *          animation: {
        *             open: {
        *                 effects: "fadeIn",
        *                 duration: 300,
        *                 show: true
        *             }
        *          }
        *      });
        *  </script>
        *
        * @option {Object} [animation.close] <> Animation to be used for closing of the popup.
        * _example
        *  //combobox initialization
        *  <script>
        *      $("#combobox").kendoComboBox({
        *          dataSource: dataSource,
        *          animation: {
        *             close: {
        *                 effects: "fadeOut",
        *                 duration: 300,
        *                 hide: true
        *                 show: false
        *             }
        *          }
        *      });
        *  </script>
        *  @option {String} [placeholder] <""> A string that appears in the textbox when the combobox has no value.
        *  _example
        *  //combobox initialization
        *  <script>
        *      $("#combobox").kendoComboBox({
        *          dataSource: dataSource,
        *          placeholder: "Select..."
        *      });
        *  </script>
        *  _example
        *  <input id="combobox" placeholder="Select..." />
        *
        *  //combobox initialization
        *  <script>
        *      $("#combobox").kendoComboBox({
        *          dataSource: dataSource
        *      });
        *  </script>
        */
        init: function(element, options) {
            var that = this, wrapper, text;

            options = $.isArray(options) ? { dataSource: options } : options;

            Select.fn.init.call(that, element, options);

            options = that.options;
            element = that.element.focus(function() {
                        that.input.focus();
                      });

            options.placeholder = options.placeholder || element.attr("placeholder");

            that._reset();

            that._wrapper();

            that._input();

            that._popup();

            that._accessors();

            that._dataSource();

            that._enable();

            that._cascade();

            wrapper = that._inputWrapper;

            that.input.bind({
                keydown: proxy(that._keydown, that),
                focus: function() {
                    wrapper.addClass(FOCUSED);
                    that._placeholder(false);
                },
                blur: function() {
                    wrapper.removeClass(FOCUSED);
                    clearTimeout(that._typing);
                    that.text(that.text());
                    that._placeholder();
                    that._blur();
                }
            });

            that._oldIndex = that.selectedIndex = -1;
            that._old = that.value();

            if (options.autoBind) {
                that._selectItem();
            } else {
                text = options.text;

                if (!text && element.is(SELECT)) {
                    text = element.children(":selected").text();
                }

                if (text) {
                    that.input.val(text);
                }
            }

            if (!text) {
                that._placeholder();
            }

            kendo.notify(that);
        },

        options: {
            name: "ComboBox",
            enable: true,
            index: -1,
            autoBind: true,
            delay: 200,
            dataTextField: "",
            dataValueField: "",
            minLength: 0,
            height: 200,
            highlightFirst: true,
            template: "",
            filter: "none",
            placeholder: "",
            suggest: false,
            ignoreCase: true,
            animation: {}
        },

        events:[
            /**
            * Fires when the drop-down list is opened
            * @name kendo.ui.ComboBox#open
            * @event
            * @param {Event} e
            * @example
            * $("#comboBox").kendoComboBox({
            *     open: function(e) {
            *             // handle event
            *         }
            * });
            * @exampleTitle To set after initialization
            * @example
            * // get a reference to instance of the Kendo UI ComboBox
            * var combobox = $("#comboBox").data("kendoComboBox");
            * // bind to the open event
            * combobox.bind("open", function(e) {
            *     // handle event
            * });
            */
            "open",

            /**
            * Fires when the drop-down list is closed
            * @name kendo.ui.ComboBox#close
            * @event
            * @param {Event} e
            * @example
            * $("#comboBox").kendoComboBox({
            *     close: function(e) {
            *         // handle event
            *     }
            * });
            * @exampleTitle To set after initialization
            * @example
            * // get a reference to instance of the Kendo UI ComboBox
            * var combobox = $("#comboBox").data("kendoComboBox");
            * // bind to the close event
            * combobox.bind("close", function(e) {
            *     // handle event
            * });
            */
            "close",

            /**
            * Fires when the value has been changed.
            * @name kendo.ui.ComboBox#change
            * @event
            * @param {Event} e
            * @example
            * $("#comboBox").kendoComboBox({
            *     change: function(e) {
            *         // handle event
            *     }
            * });
            * @exampleTitle To set after initialization
            * @example
            * // get a reference to instance of the Kendo UI ComboBox
            * var combobox = $("#comboBox").data("kendoComboBox");
            * // bind to the change event
            * combobox.bind("change", function(e) {
            *     // handle event
            * });
            */
            CHANGE,
            /**
            *
            * Triggered when a Li element is selected.
            *
            * @name kendo.ui.ComboBox#select
            * @event
            *
            * @param {Event} e
            *
            * @param {jQuery} e.item
            * The selected item chosen by a user.
            *
            * @exampleTitle Attach select event handler during initialization; detach via unbind()
            * @example
            * // event handler for select
            * var onSelect = function(e) {
            *     // access the selected item via e.item (jQuery object)
            * };
            *
            * // attach select event handler during initialization
            * var combobox = $("#combobox").kendoComboBox({
            *     select: onSelect
            * });
            *
            * // detach select event handler via unbind()
            * combobox.data("kendoComboBox").unbind("select", onSelect);
            *
            * @exampleTitle Attach select event handler via bind(); detach via unbind()
            * @example
            * // event handler for select
            * var onSelect = function(e) {
            *     // access the selected item via e.item (jQuery object)
            * };
            *
            * // attach select event handler via bind()
            * $("#combobox").data("kendoComboBox").bind("select", onSelect);
            *
            * // detach select event handler via unbind()
            * $("#combobox").data("kendoComboBox").unbind("select", onSelect);
            *
            */
            "select",
            "dataBinding",
            "dataBound"
        ],
        setOptions: function(options) {
            Select.fn.setOptions.call(this, options);

            this._template();
            this._accessors();
        },

        current: function(li) {
            var that = this,
                current = that._current;

            if (li === undefined) {
                return current;
            }

            if (current) {
                current.removeClass(STATE_SELECTED);
            }

            Select.fn.current.call(that, li);
        },

        /**
        * Returns the raw data record at the specified index. If the index is not specified, the selected index will be used.
        * @name kendo.ui.ComboBox#dataItem
        * @function
        * @param {Number} index The zero-based index of the data record
        * @returns {Object} The raw data record. Returns <i>undefined</i> if no data.
        * @example
        * var combobox = $("#combobox").data("kendoComboBox");
        *
        * // get the dataItem corresponding to the selectedIndex.
        * var dataItem = combobox.dataItem();
        *
        * // get the dataItem corresponding to the passed index.
        * var dataItem = combobox.dataItem(1);
        */

        /**
        * Closes the drop-down list.
        * @name kendo.ui.ComboBox#close
        * @function
        * @example
        * // get a reference to instance of the Kendo UI ComboBox
        * var combobox = $("#comboBox").data("kendoComboBox");
        * combobox.close();
        */
        /**
        * Enables/disables the combobox widget
        * @param {Boolean} enable Desired state
        * @example
        * // get a reference to instance of the Kendo UI ComboBox
        * var combobox = $("#comboBox").data("kendoComboBox");
        * // disables the combobox
        * combobox.enable(false);
        */
        enable: function(enable) {
            var that = this,
                input = that.input.add(that.element),
                wrapper = that._inputWrapper.unbind(HOVEREVENTS),
                arrow = that._arrow.parent().unbind(CLICK + " " + MOUSEDOWN);

            if (enable === false) {
                wrapper
                    .removeClass(DEFAULT)
                    .addClass(DISABLED);

                input.attr(ATTRIBUTE, ATTRIBUTE);
            } else {
                wrapper
                    .removeClass(DISABLED)
                    .addClass(DEFAULT)
                    .bind(HOVEREVENTS, that._toggleHover);

                input.removeAttr(ATTRIBUTE);
                arrow.bind(CLICK, function() { that.toggle(); })
                     .bind(MOUSEDOWN, function(e) { e.preventDefault(); });
            }
        },

        /**
        * Opens the drop-down list.
        * @example
        * // get a reference to instance of the Kendo UI ComboBox
        * var combobox = $("#comboBox").data("kendoComboBox");
        * combobox.open();
        */
        open: function() {
            var that = this,
                serverFiltering = that.dataSource.options.serverFiltering;

            if (that.popup.visible()) {
                return;
            }

            if (!that.ul[0].firstChild || (that._state === STATE_ACCEPT && !serverFiltering)) {
                that._open = true;
                that._state = STATE_REBIND;
                that._selectItem();
            } else {
                that.popup.open();
                that._scroll(that._current);
            }
        },

        /**
        * Re-render the items of the drop-down list.
        * @name kendo.ui.ComboBox#refresh
        * @function
        * @example
        * // get a referenence to the Kendo UI ComboBox
        * var combobox = $("#combobox").data("kendoComboBox");
        * // re-render the items of the drop-down list.
        * combobox.refresh();
        */
        refresh: function() {
            var that = this,
                ul = that.ul[0],
                options = that.options,
                value = that.value(),
                data = that._data(),
                length = data.length;

            that.trigger("dataBinding");

            ul.innerHTML = kendo.render(that.template, data);
            that._height(length);

            if (that.element.is(SELECT)) {
                that._options(data);

                if (value && that._state === STATE_REBIND) {
                    that._state = "";
                    that.value(value);
                }
            }

            if (length) {
                if (options.highlightFirst) {
                    that.current($(ul.firstChild));
                }

                if (options.suggest && that.input.val()) {
                    that.suggest($(ul.firstChild));
                }
            }

            if (that._open) {
                that._open = false;
                that.toggle(!!length);
            }

            if (that._touchScroller) {
                that._touchScroller.reset();
            }

            that._makeUnselectable();

            that._hideBusy();
            that.trigger("dataBound");
        },

        /**
        * Selects drop-down list item and sets the value and the text of the combobox.
        * @param {jQueryObject | Number | Function} li LI element or index of the item or predicate function, which defines the item that should be selected.
        * @returns {Integer} The index of the selected LI element.
        * @example
        * var combobox = $("#combobox").data("kendoComboBox");
        *
        * // selects by jQuery object
        * combobox.select(combobox.ul.children().eq(0));
        *
        * // selects by index
        * combobox.select(1);
        *
        * // selects item if its text is equal to "test" using predicate function
        * combobox.select(function(dataItem) {
        *     return dataItem.text === "test";
        * });
        */
        select: function(li) {
            var that = this;

            if (li === undefined) {
                return that.selectedIndex;
            } else {
                that._select(li);
                that._old = that._accessor();
                that._oldIndex = that.selectedIndex;
            }
        },

        /**
        * Filters dataSource using the provided parameter and rebinds drop-down list.
        * @param {string} word The filter value.
        * @example
        * var combobox = $("#combobox").data("kendoComboBox");
        *
        * // Searches for item which has "In" in the name.
        * combobox.search("In");
        */
        search: function(word) {
            word = typeof word === "string" ? word : this.text();
            var that = this,
                length = word.length,
                options = that.options,
                ignoreCase = options.ignoreCase,
                filter = options.filter,
                field = options.dataTextField,
                filters, expression;

            clearTimeout(that._typing);

            if (length >= options.minLength) {
                if (filter === "none") {
                    that._filter(word);
                } else {
                    that._open = true;
                    that._state = STATE_FILTER;

                    expression = that.dataSource.filter() || {};
                    removeFiltersForField(expression, field);

                    filters = expression.filters || [];
                    filters.push({
                        value: ignoreCase ? word.toLowerCase() : word,
                        field: field,
                        operator: filter,
                        ignoreCase: ignoreCase
                    });

                    that.dataSource.filter(filters);
                }
            }
        },

        /**
        * Forces a suggestion onto the text of the ComboBox.
        * @param {string} value Characters to force a suggestion.
        * @example
        * // note that this suggest is not the same as the configuration method
        * // suggest which enables/disables auto suggesting for the ComboBox
        * //
        * // get a referenence to the Kendo UI ComboBox
        * var combobox = $("#combobox").data("kendoComboBox");
        * // force a suggestion to the item with the name "Inception"
        * combobox.suggest("Inception");
        */
        suggest: function(word) {
            var that = this,
                element = that.input[0],
                value = that.text(),
                caret = List.caret(element),
                key = that._last,
                idx;

            if (key == keys.BACKSPACE || key == keys.DELETE) {
                that._last = undefined;
                return;
            }

            word = word || "";

            if (typeof word !== "string") {
                idx = List.inArray(word[0], that.ul[0]);

                if (idx > -1) {
                    word = that._text(that.dataSource.view()[idx]);
                } else {
                    word = "";
                }
            }

            if (caret <= 0) {
                caret = value.toLowerCase().indexOf(word.toLowerCase()) + 1;
            }

            if (word) {
                idx = word.toLowerCase().indexOf(value.toLowerCase());
                if (idx > -1) {
                    value += word.substring(idx + value.length);
                }
            } else {
                value = value.substring(0, caret);
            }

            if (value.length !== caret || !word) {
                element.value = value;
                List.selectText(element, caret, value.length);
            }
        },

        /**
        * Gets/Sets the text of the ComboBox.
        * @param {String} text The text to set.
        * @returns {String} The text of the combobox.
        * @example
        * var combobox = $("#combobox").data("kendoComboBox");
        *
        * // get the text of the combobox.
        * var text = combobox.text();
        */
        text: function (text) {
            text = text === null ? "" : text;

            var that = this,
                textAccessor = that._text,
                input = that.input[0],
                ignoreCase = that.options.ignoreCase,
                loweredText = text,
                dataItem;

            if (text !== undefined) {
                dataItem = that.dataItem();

                if (dataItem && textAccessor(dataItem) === text) {
                    return;
                }

                if (ignoreCase) {
                    loweredText = loweredText.toLowerCase();
                }

                that._select(function(data) {
                    data = textAccessor(data);

                    if (ignoreCase) {
                        data = (data + "").toLowerCase();
                    }

                    return data === loweredText;
                });

                if (that.selectedIndex < 0) {
                    that._custom(text);
                    input.value = text;
                }

            } else {
                return input.value;
            }
        },

        /**
        * Toggles the drop-down list between opened and closed state.
        * @param {Boolean} toggle Defines the whether to open/close the drop-down list.
        * @example
        * var combobox = $("#combobox").data("kendoComboBox");
        *
        * // toggles the open state of the drop-down list.
        * combobox.toggle();
        */
        toggle: function(toggle) {
            var that = this;

            that._toggle(toggle);
        },

        /**
        * Gets/Sets the value of the combobox. If the value is undefined, text of the data item will be used.
        * @param {String} value The value to set.
        * @returns {String} The value of the combobox.
        * @example
        * var combobox = $("#combobox").data("kendoComboBox");
        *
        * // get the value of the combobox.
        * var value = combobox.value();
        *
        * // set the value of the combobox.
        * combobox.value("1"); //looks for item which has value "1"
        */
        value: function(value) {
            var that = this,
                idx;

            if (value !== undefined) {
                if (value !== null) {
                    value = value.toString();
                }

                if (value && that._valueOnFetch(value)) {
                    return;
                }

                idx = that._index(value);

                if (idx > -1) {
                    that.select(idx);
                } else {
                    that.current(NULL);
                    that._custom(value);
                    that.text(value);
                }

                that._old = that._accessor();
                that._oldIndex = that.selectedIndex;
            } else {
                return that._accessor();
            }
        },

        _accept: function(li) {
            var that = this;

            if (li && that.popup.visible()) {

                if (that._state === STATE_FILTER) {
                    that._state = STATE_ACCEPT;
                }

                that._focus(li);
            } else {
                that.text(that.text());
                that._change();
            }
        },

        _custom: function(value) {
            var that = this,
                element = that.element,
                custom = that._option;

            if (element.is(SELECT)) {
                if (!custom) {
                    custom = that._option = $("<option/>");
                    element.append(custom);
                }
                custom.text(value);
                custom[0].selected = true;
            } else {
                element.val(value);
            }
        },

        _filter: function(word) {
            var that = this,
                options = that.options,
                dataSource = that.dataSource,
                ignoreCase = options.ignoreCase,
                predicate = function (dataItem) {
                    var text = that._text(dataItem);
                    if (text !== undefined) {
                        text = text + "";
                        if (text !== "" && word === "") {
                            return false;
                        }

                        if (ignoreCase) {
                            text = text.toLowerCase();
                        }

                        return text.indexOf(word) === 0;
                    }
                };

            if (ignoreCase) {
                word = word.toLowerCase();
            }

            if (!that.ul[0].firstChild) {
                dataSource.one(CHANGE, function () { that.search(word); }).fetch();
                return;
            }

            if (that._highlight(predicate) !== -1) {
                if (options.suggest && that._current) {
                    that.suggest(that._current);
                }
                that.open();
            }

            that._hideBusy();
        },

        _highlight: function(li) {
            var that = this, idx;

            if (li === undefined || li === null) {
                return -1;
            }

            li = that._get(li);
            idx = List.inArray(li[0], that.ul[0]);

            if (idx == -1) {
                if (that.options.highlightFirst && !that.text()) {
                    li = $(that.ul[0].firstChild);
                } else {
                    li = NULL;
                }
            }

            that.current(li);

            return idx;
        },

        _input: function() {
            var that = this,
                element = that.element[0],
                tabIndex = element.tabIndex,
                wrapper = that.wrapper,
                SELECTOR = ".k-input",
                input;

            input = wrapper.find(SELECTOR);

            if (!input[0]) {
                wrapper.append('<span unselectable="on" class="k-dropdown-wrap k-state-default"><input class="k-input" type="text" autocomplete="off"/><span unselectable="on" class="k-select"><span unselectable="on" class="k-icon k-arrow-down">select</span></span></span>')
                       .append(that.element);

                input = wrapper.find(SELECTOR);
            }

            input[0].tabIndex = tabIndex;
            input[0].style.cssText = element.style.cssText;
            input.addClass(element.className)
                 .val(element.value)
                 .css({
                    width: "100%",
                    height: element.style.height
                 })
                 .show();

            if (placeholderSupported) {
                input.attr("placeholder", that.options.placeholder);
            }

            that._focused = that.input = input;
            that._arrow = wrapper.find(".k-icon");
            that._inputWrapper = $(wrapper[0].firstChild);
        },

        _keydown: function(e) {
            var that = this,
                key = e.keyCode,
                input = that.input;

            that._last = key;

            clearTimeout(that._typing);

            if (key == keys.TAB) {
                that.text(input.val());

                if (that._state === STATE_FILTER && that.selectedIndex > -1) {
                    that._state = STATE_ACCEPT;
                }
            } else if (!that._move(e)) {
               that._search();
            }
        },

        _placeholder: function(show) {
            if (placeholderSupported) {
                return;
            }

            var that = this,
                input = that.input,
                placeholder = that.options.placeholder,
                value;

            if (placeholder) {
                value = that.value();

                if (show === undefined) {
                    show = !value;
                }

                input.toggleClass("k-readonly", show);

                if (!show) {
                    if (!value) {
                        placeholder = "";
                    } else {
                        return;
                    }
                }

                input.val(placeholder);
            }
        },

        _search: function() {
            var that = this;

            that._typing = setTimeout(function() {
                var value = that.text();
                if (that._prev !== value) {
                    that._prev = value;
                    that.search(value);
                }
            }, that.options.delay);
        },

        _select: function(li) {
            var that = this,
                text,
                value,
                idx = that._highlight(li),
                data = that._data();

            that.selectedIndex = idx;

            if (idx !== -1) {
                that._current.addClass(STATE_SELECTED);

                data = data[idx];
                text = that._text(data);
                value = that._value(data);

                that._prev = that.input[0].value = text;
                that._accessor(value !== undefined ? value : text, idx);
                that._placeholder();
            }
        },

        _selectItem: function() {
            var that = this,
                options = that.options,
                dataSource = that.dataSource,
                expression = dataSource.filter() || {};

            removeFiltersForField(expression, that.options.dataTextField);

            that.dataSource.one(CHANGE, function() {
                var value = options.value || that.value();
                if (value) {
                    that.value(value);
                } else {
                    that.select(options.index);
                }
                that.trigger("selected");
            }).filter(expression);
        },

        _wrapper: function() {
            var that = this,
                element = that.element,
                wrapper;

            wrapper = element.parent();

            if (!wrapper.is("span.k-widget")) {
                wrapper = element.hide().wrap("<span />").parent();
            }

            wrapper[0].style.cssText = element[0].style.cssText;
            that.wrapper = wrapper.addClass("k-widget k-combobox k-header")
                                  .addClass(element[0].className)
                                  .show();
        }
    });

    ui.plugin(ComboBox);
})(jQuery);
