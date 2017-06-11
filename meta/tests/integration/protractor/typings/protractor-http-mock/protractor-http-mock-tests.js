"use strict";
var mock = require("protractor-http-mock");
function TestConfig() {
    mock.config = {
        rootDirectory: "root",
        protractorConfig: "protractor.conf.js"
    };
}
function TestCtorOverloads() {
    var del = {
        request: {
            path: 'path',
            method: 'DELETE'
        },
        response: {
            status: 400,
            data: 1
        }
    };
    var put = {
        request: {
            path: 'path',
            method: 'PUT'
        },
        response: {
            status: 400,
            data: 1
        }
    };
    var plugin = {
        match: function (mockRequest, requestConfig) {
            if (requestConfig.request.method && mockRequest.request.method) {
                return true;
            }
            return false;
        }
    };
    var noParam = mock();
    var emptyArray = mock([]);
    var mockFiles = mock(['mock1', 'mock2']);
    var mocks = mock([del, put]);
    var mockFilesNpmPlugins = mock(['mock1'], ['plugin']);
    var mocksWithNpmPlugins = mock([del, put], ['plugin']);
    var pluginMocks = mock([del, put], [plugin]);
    var mockFilesNpmPluginsSkipDefaults = mock(['mock1'], ['plugin'], true);
    var skipDefaults = mock([del, put], [plugin], true);
}
function TestTeardown() {
    mock.teardown();
}
function TestRequestsMade() {
    var values;
    mock.requestsMade().then(function (v) { return values = v; });
}
function TestClearRequests() {
    var promiseValue;
    mock.clearRequests().then(function (value) {
        promiseValue = value;
    });
}
function TestDynamicAdd() {
    var put = {
        request: {
            path: "path",
            method: "PUT"
        },
        response: {
            status: 400,
            data: 1
        }
    };
    var resolved;
    mock.add([put]).then(function (r) { return resolved = r; });
}
function TestDyanmicRemove() {
    var put = {
        request: {
            path: "path",
            method: "PUT"
        },
        response: {
            status: 400,
            data: 1
        }
    };
    var resolved;
    mock.remove([put]).then(function (r) { return resolved = r; });
}
function TestGetRequestDefinitions() {
    var getMinium = {
        request: {
            path: 'path',
            method: 'GET',
            regex: true
        },
        response: {
            data: 1,
            status: 500
        }
    };
    var getParams = {
        request: {
            path: 'path',
            method: 'GET',
            regex: true,
            params: {
                param1: 'param1',
                param2: 2
            }
        },
        response: {
            data: 1,
            status: 500
        }
    };
    var post = {
        request: {
            path: 'path',
            method: 'POST',
            regex: true
        },
        response: {
            data: 1,
            status: 500
        }
    };
    var getQueryString = {
        request: {
            path: 'path',
            method: 'GET',
            regex: true,
            queryString: {
                query1: 'query1',
                query2: 2
            }
        },
        response: {
            data: 1,
            status: 500
        }
    };
    var getHeaders = {
        request: {
            path: 'path',
            method: 'GET',
            regex: true,
            headers: {
                head1: 'head1',
                head2: 'head2'
            }
        },
        response: {
            data: 1,
            status: 500
        }
    };
}
function TestPostRequestDefinitions() {
    var post = {
        request: {
            path: 'path',
            method: 'POST',
            regex: true
        },
        response: {
            data: 1,
            status: 500
        }
    };
    var postData = {
        request: {
            path: 'path',
            method: 'POST',
            data: 'data',
            regex: true
        },
        response: {
            data: 1,
            status: 500
        }
    };
}
function TestHeadRequestDefinitions() {
    var head = {
        request: {
            path: 'path',
            method: 'HEAD',
            regex: true
        },
        response: {
            status: 500,
            data: 1
        }
    };
}
function TestDeleteRequestDefinitions() {
    var del = {
        request: {
            path: 'path',
            method: 'DELETE',
            regex: true
        },
        response: {
            status: 500,
            data: 1
        }
    };
}
function TestPutRequestDefinitions() {
    var put = {
        request: {
            path: 'path',
            method: 'PUT',
            regex: true
        },
        response: {
            status: 500,
            data: 1
        }
    };
}
function TestPatchRequestDefinitions() {
    var patch = {
        request: {
            path: 'path',
            method: 'PATCH',
            regex: true
        },
        response: {
            status: 500,
            data: 1
        }
    };
}
function TestJsonpRequestDefinitions() {
    var jsonp = {
        request: {
            path: 'path',
            method: 'JSONP',
            regex: true
        },
        response: {
            status: 500,
            data: 1
        }
    };
}
function TestRuntimeMocks() {
    mock.add([{
            request: {
                path: '/users',
                method: 'GET',
                params: {
                    name: 'Charlie'
                }
            },
            response: {
                data: {
                    name: 'Override'
                }
            }
        }]);
    mock.remove([{
            request: {
                path: '/users',
                method: 'GET',
                params: {
                    name: 'Charlie'
                }
            },
            response: {
                data: {
                    name: 'Override'
                }
            }
        }]);
}
