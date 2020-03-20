/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
/*
 * Your Member ViewModel code goes here
 */
define(['accUtils',
  'knockout',
  'jquery',
  'ojs/ojarraydataprovider',
  'persist/persistenceStoreManager',
  'persist/pouchDBPersistenceStoreFactory',
  'persist/persistenceManager',
  'persist/defaultResponseProxy',
  'ojs/ojformlayout',
  'ojs/ojinputtext',
  'ojs/ojbutton',
  'ojs/ojlistview'],
  function (accUtils, ko, $, ArrayDataProvider, persistenceStoreManager,
    pouchDBPersistenceStoreFactory,
    persistenceManager,
    defaultResponseProxy) {

    function MemberViewModel() {
      var self = this;
      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.

      self.district = ko.observable('');
      self.name = ko.observable('');
      self.allMembers = ko.observableArray();
      self.dataProvider = ko.observable();

      self.fetchData = function (event) {
        if (event) {
          $.ajax({
            url: 'http://dummy.restapiexample.com/api/v1/employees',
            type: 'GET',
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {
              self.allMembers.removeAll();
              self.allMembers(data.data);
              self.dataProvider(new ArrayDataProvider(self.allMembers, { keyAttributes: 'id' }));

            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.log('Fetch Failed');
            }
          });
        }
      };

      persistenceStoreManager.registerDefaultStoreFactory(pouchDBPersistenceStoreFactory);
      persistenceManager.init().then(function() {
        persistenceManager.register({scope: '/employees'})
          .then(function(registration) {
            var responseProxy = defaultResponseProxy.getResponseProxy();
            var fetchListener = responseProxy.getFetchEventListener();
            registration.addEventListener('fetch', fetchListener);
          });
      });

      self.addMember = function () {
        console.log('addMember');
      };
      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * This method might be called multiple times - after the View is created
       * and inserted into the DOM and after the View is reconnected
       * after being disconnected.
       */
      self.connected = function () {
        accUtils.announce('Members page loaded.');
        document.title = "Members";
        // Implement further logic if needed

        self.fetchData();
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      self.disconnected = function () {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      self.transitionCompleted = function () {
        // Implement if needed
      };
    }

    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return MemberViewModel;
  }
);
