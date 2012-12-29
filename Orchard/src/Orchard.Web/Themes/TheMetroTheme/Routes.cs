/****************************************************************
 *  Theme: The Metro Theme for Orchard
 *  Author: Marco Siniscalco
 *  Copyright: 2012, Marco Siniscalco. All Rights Reserved
 *  Project Site: http://orchardmetrotheme.codeplex.com/
 ***************************************************************/

﻿using System.Collections.Generic;
using System.Web.Mvc;
using System.Web.Routing;
using Orchard.Mvc.Routes;

namespace TheMetroTheme
{
    public class Routes : IRouteProvider
    {
        public void GetRoutes(ICollection<RouteDescriptor> routes)
        {
            foreach (var routeDescriptor in GetRoutes())
                routes.Add(routeDescriptor);
        }

        public IEnumerable<RouteDescriptor> GetRoutes()
        {
            return new[] {
                            new RouteDescriptor {
                                                    Priority = 5,
                                                    Route = new Route(Constants.ROUTES_AREA_NAME,
                                                        new RouteValueDictionary {
                                                            {"area", Constants.ROUTES_AREA_NAME},
                                                            {"controller", "Admin"},
                                                            {"action", "Index"}
                                                        },
                                                        new RouteValueDictionary(),
                                                        new RouteValueDictionary {
                                                            {"area", Constants.ROUTES_AREA_NAME}
                                                        },
                                                        new MvcRouteHandler())
                                                }
                         };
        }
    }
}
