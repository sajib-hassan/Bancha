/*!
 *
 * Bancha Project : Seamlessly integrates CakePHP with ExtJS and Sencha Touch (http://banchaproject.org)
 * Copyright 2011-2013 codeQ e.U.
 *
 * @package       Bancha
 * @copyright     Copyright 2011-2013 codeQ e.U.
 * @link          http://banchaproject.org Bancha Project
 * @since         Bancha v 2.0.0
 * @author        Roland Schuetz <mail@rolandschuetz.at>
 * @version       Bancha v PRECOMPILER_ADD_RELEASE_VERSION
 *
 * For more information go to http://banchaproject.org
 */

/**
 * @private
 * @class Bancha.Loader
 *
 * The Sencha class loading is a beautiful concept and brings an enormous power to
 * javascript. But the Sencha class loader does not allow any custom behavior.
 *
 * Since Bancha creates models and stores dynamically from server models the
 * Sencha conventions does not apply for loading these classes. We will utilize
 * Bancha.loader.Models to load these elements.
 *
 * This loader incorporates the Java class loader principles of Delegation and
 * Uniqueness, while still keeping all Visibility in the main Ext.Loader.
 *
 * This class now simply extends {@class Ext.Loader} to allow the usage of custom
 * loaders, while the actual Bancha loading logic lies in {@Bancha.loader.Models}.
 *
 * See also http://banchaproject.org/blog-entry/items/building-a-customer-class-loader-for-sencha.html
 *
 * @since Bancha v 2.0.0
 * @author Roland Schuetz <mail@rolandschuetz.at>
 * @docauthor Roland Schuetz <mail@rolandschuetz.at>
 */
Ext.define('Bancha.Loader', {
    requires: 'Ext.Loader'
}, function() {

    // Ext.Loader is a singleton,
    // so we need to directly apply the overrides
    Ext.apply(Ext.Loader, {

        /**
         * @private
         * @member Bancha.Loader
         * @cfg {Bancha.loader.Interface} current default class loader
         */
        defaultLoader: null,

        /**
         * @private
         * @member Bancha.Loader
         *
         * Registers a new Loader as the default loader inside
         * the whole application.
         *
         * To create your own loader extend {class Bancha.loader.Interface}
         * and add your own logic. You might chain loaders.
         *
         * @param  {Bancha.loader.Interface} loader The loader to use
         * @return {void}
         */
        setDefaultLoader: function(loader) {
            this.defaultLoader = loader;
        },

        /**
         * @private
         * @member Bancha.Loader
         *
         * Returns the currently set up loader.
         *
         * @return {Bancha.loader.Interface|null} application class loader
         */
        getDefaultLoader: function() {
            return this.defaultLoader;
        },


        /**
         * @private // the override is private
         * @member Bancha.Loader
         *
         * The highjacked #loadScriptFile doesn't get the className as
         * argument, only the filePath. Inside #require #getPath is
         * called.
         * Therefore we keep track of the last used className for
         * #getPath to use it in our #loadScriptFile interceptor.
         * Yes, this is a dirty hack. But it prevents a lot of
         * code duplication and update issues.
         *
         */
        getPath: Ext.Function.createInterceptor(Ext.Loader.getPath, function(className) {
            this.getPathLastClassName = className;
        }, Ext.Loader),

        /**
         * @private
         * @member Bancha.Loader
         *
         * The original method Loads a script file, supports both asynchronous and
         * synchronous approaches.
         *
         * Bancha.Loader adds the logic to also use other loaders, which are set
         * using #setDefaultLoader.
         *
         * @param  {String}   url         The url to load data from, see also #getPath
         * @param  {Function} onLoad      To be executed when the class was successfully loaded.
         * @param  {Function} onError     To be executed is something went wrong.
         * @param  {Object}   scope       The scope to use for onLoad and onError
         * @param  {Boolean}  synchronous True is the file should be loaded synchronous.
         */
        loadScriptFile: Ext.Function.createInterceptor(Ext.Loader.loadScriptFile,
            function(url, onLoad, onError, scope, synchronous) {

            // from original function
            if (this.isFileLoaded[url]) {
                return this;
            }
            this.isLoading = true;

            // see getPath override
            var className = this.getPathLastClassName,
                current;

            // ExtJS 4.0.7 returns undefined instead of false, fix this
            synchronous = synchronous || false;

            // if we have a default class loader set, use it
            if(this.getDefaultLoader()) {
                // see if the child class loader wants to handle this
                current = this.getDefaultLoader();
                if(current.handles(className)) {
                    current.loadClass(className, onLoad, onError, scope, synchronous);
                    return false; // don't call the original fn
                }
                while(current.getParentLoader()) {
                    current = current.getParentLoader();
                    if(current.handles(className)) {
                        current.loadClass(className, onLoad, onError, scope, synchronous);
                        return false; // don't call the original fn
                    }
                }
            }

            //ok, delegate to the original fn
            return true;
        }, Ext.Loader) //eo loadScriptFile
    });
});
