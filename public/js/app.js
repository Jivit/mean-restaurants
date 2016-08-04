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
            .when("/new/restaurant", {
                controller: "NewRestaurantController",
                templateUrl: "restaurant-form.html"
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
    .service("Restaurants", function($http) {
        this.getRestaurants = function() {
          return $http.get("/restaurants").
            then(function(response) {
                return response;
            }, function(response) {
                alert("Error retrieving restaurants.");
            });
        }
        this.createRestaurant = function(rest) {
            return $http.post("/restaurants", rest).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error creating restaurant.");
                });
        }
        this.getRestaurant = function(restId) {
            var url = "/restaurants/" + restId;
            return $http.get(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding this restaurant.");
                });
        }
        this.editRestaurant = function(rest) {
            var url = "/restaurants/" + rest._id;
            console.log(rest._id);
            return $http.put(url, rest).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error editing this restaurant.");
                    console.log(response);
                });
        }
        this.deleteRestaurant = function(restId) {
            var url = "/restaurants/" + restId;
            return $http.delete(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error deleting this restaurant.");
                    console.log(response);
                });
        }
    })
    .controller("rListController", function(restaurants, $scope) {
        $scope.restaurants = restaurants.data;
    })
    .controller("NewRestaurantController", function($scope, $location, Restaurants) {
        $scope.grades = [];

        $scope.back = function() {
            $location.path("/restaurants");
        }

        $scope.addGrade = function() {
            $scope.grades.push({ 
                grade: "",
                score: "",
                date: ""
            });
        }

        $scope.saveRestaurant = function(rest) {
            Restaurants.createRestaurant(rest).then(function(doc) {
                var restUrl = "/restaurant/" + doc.data._id;
                $location.path(restUrl);
            }, function(response) {
                alert(response);
            });
        }
    })
    .controller("EditRestaurantController", function($scope, $routeParams, $location, Restaurants) {
        Restaurants.getRestaurant($routeParams.restId).then(function(doc) {
            $scope.rest = doc.data;
        }, function(response) {
            alert(response);
        });

        $scope.toggleEdit = function() {
            $scope.editMode = true;
            $scope.restFormUrl = "restaurant-form.html";
        }

        $scope.back = function() {
            $scope.editMode = false;
            $scope.restFormUrl = "";
        }

        $scope.addGrade = function() {
            alert("lala");
        }

        $scope.saveRestaurant = function(rest) {
            alert("Restaurant updated!");
            Restaurants.editRestaurant(rest);
            $scope.editMode = false;
            $scope.restFormUrl = "";
        }

        $scope.deleteRestaurant = function(restId) {
            var res = confirm("Are you sure you want to delete this restaurant?");
            if (res) {
                Restaurants.deleteRestaurant(restId);
                $location.path("/restaurants");
            }
            else {
                $location.path("/restaurant/" + restId);
            }
        }
    });
