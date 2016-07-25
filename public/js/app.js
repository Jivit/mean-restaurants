angular.module("contactsApp", ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "main.html",
            })
            .when("/contacts", {
                templateUrl: "list.html",
                controller: "ListController",
                resolve: {
                    contacts: function(Contacts) {
                        return Contacts.getContacts();
                    }
                }
            })
            .when("/new/contact", {
                controller: "NewContactController",
                templateUrl: "contact-form.html"
            })
            .when("/contact/:contactId", {
                controller: "EditContactController",
                templateUrl: "contact.html"
            })
            .when("/restaurants", {
                templateUrl: "rList.html",
                controller: "rListController",
                resolve: {
                  restaurants: function(Restaurants) {
                      return Restaurants.getRestaurants();
                  }
                }
            })
            .when("/restaurant/:restId", {
                controller: "EditRestaurantController",
                templateUrl: "restaurant.html"
            })
            .otherwise({
                redirectTo: "/"
            })
    })
    .service("Contacts", function($http) {
        this.getContacts = function() {
            return $http.get("/contacts").
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding contacts.");
                });
        }
        this.createContact = function(contact) {
            return $http.post("/contacts", contact).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error creating contact.");
                });
        }
        this.getContact = function(contactId) {
            var url = "/contacts/" + contactId;
            return $http.get(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding this contact.");
                });
        }
        this.editContact = function(contact) {
            var url = "/contacts/" + contact._id;
            console.log(contact._id);
            return $http.put(url, contact).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error editing this contact.");
                    console.log(response);
                });
        }
        this.deleteContact = function(contactId) {
            var url = "/contacts/" + contactId;
            return $http.delete(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error deleting this contact.");
                    console.log(response);
                });
        }
    })
    .service("Restaurants", function($http) {
        this.getRestaurants = function() {
          return $http.get("/restaurants").
            then(function(response) {
                return response;
            }, function(response) {
                alert("Error retrieving restaurants.");
            });
        }
        this.getRestaurant = function(resttId) {
            var url = "/restaurants/" + restId;
            return $http.get(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding this restaurant.");
                });
        }
      })
    .controller("ListController", function(contacts, $scope) {
        $scope.contacts = contacts.data;
    })
    .controller("NewContactController", function($scope, $location, Contacts) {
        $scope.back = function() {
            $location.path("#/");
        }

        $scope.saveContact = function(contact) {
            Contacts.createContact(contact).then(function(doc) {
                var contactUrl = "/contact/" + doc.data._id;
                $location.path(contactUrl);
            }, function(response) {
                alert(response);
            });
        }
    })
    .controller("EditContactController", function($scope, $routeParams, Contacts) {
        Contacts.getContact($routeParams.contactId).then(function(doc) {
            $scope.contact = doc.data;
        }, function(response) {
            alert(response);
        });

        $scope.toggleEdit = function() {
            $scope.editMode = true;
            $scope.contactFormUrl = "contact-form.html";
        }

        $scope.back = function() {
            $scope.editMode = false;
            $scope.contactFormUrl = "";
        }

        $scope.saveContact = function(contact) {
            Contacts.editContact(contact);
            $scope.editMode = false;
            $scope.contactFormUrl = "";
        }

        $scope.deleteContact = function(contactId) {
            Contacts.deleteContact(contactId);
        }
    })
    .controller("rListController", function(restaurants, $scope) {
        $scope.restaurants = restaurants.data;
    })
    .controller("EditRestaurantController", function($scope, $routeParams, Restaurants) {
        Restaurants.getRestaurant($routeParams.restaurantId).then(function(doc) {
            $scope.rest = doc.data;
        }, function(response) {
            alert(response);
        });

        // $scope.toggleEdit = function() {
        //     $scope.editMode = true;
        //     $scope.contactFormUrl = "contact-form.html";
        // }

        // $scope.back = function() {
        //     $scope.editMode = false;
        //     $scope.contactFormUrl = "";
        // }

        // $scope.saveContact = function(contact) {
        //     Contacts.editContact(contact);
        //     $scope.editMode = false;
        //     $scope.contactFormUrl = "";
        // }

        // $scope.deleteContact = function(contactId) {
        //     Contacts.deleteContact(contactId);
        // }
    });