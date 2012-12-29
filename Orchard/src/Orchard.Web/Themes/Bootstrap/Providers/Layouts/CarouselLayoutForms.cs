using System;
using Orchard.DisplayManagement;
using Orchard.Forms.Services;
using Orchard.Localization;

namespace Orchard.Projections.Providers.Layouts {

    public class CarouselLayoutForms : IFormProvider {
        protected dynamic Shape { get; set; }
        public Localizer T { get; set; }

        public CarouselLayoutForms(
            IShapeFactory shapeFactory) {
            Shape = shapeFactory;
            T = NullLocalizer.Instance;
        }

        public void Describe(DescribeContext context) {
            Func<IShapeFactory, object> form =
                shape => {

                    var f = Shape.Form(
                        Id: "CarouselLayout",                        
                        _HtmlProperties: Shape.Fieldset(
                            Title: T("Html properties"), 
                            _ListId: Shape.TextBox(
                                Id: "outer-grid-id", Name: "OuterDivId",
                                Title: T("Outer div id"),
                                Description: T("The id to provide on the div element."),
                                Classes: new[] { "textMedium", "tokenized" }
                                ),
                            _ListClass: Shape.TextBox(
                                Id: "outer-div-class", Name: "OuterDivClass",
                                Title: T("Outer div class"),
                                Description: T("The class to provide on the div element."),
                                Classes: new[] { "textMedium", "tokenized" }
                                ),
                            _InnerClass: Shape.TextBox(
                                Id: "inner-div-class", Name: "InnerDivClass",
                                Title: T("Inner div class"),
                                Description: T("The class to provide on the inner div element."),
                                Classes: new[] { "textMedium", "tokenized" }
                                ),
                             _FirstItemClass: Shape.TextBox(
                                Id: "first-item-class", Name: "FirstItemClass",
                                Title: T("First item class"),
                                Description: T("The class to provide on the first item element."),
                                Classes: new[] { "textMedium", "tokenized" }
                                ),
                            _ItemClass: Shape.TextBox(
                                Id: "item-class", Name: "ItemClass",
                                Title: T("Item class"),
                                Description: T("The class to provide on the item element."),
                                Classes: new[] { "textMedium", "tokenized" }
                                )
                            )
                        );

                    return f;
                };

            context.Form("CarouselLayout", form);

        }
    }
   /*
    public class CarouselLayoutFormsValitator : FormHandler {
        public Localizer T { get; set; }

        public override void Validating(ValidatingContext context) {
            if (context.FormName == "CarouselLayout") {
                if (context.ValueProvider.GetValue("Alignment") == null) {
                    context.ModelState.AddModelError("Alignment", T("The field Alignment is required.").Text);
                }

                if (context.ValueProvider.GetValue("Columns") == null) {
                    context.ModelState.AddModelError("Columns", T("The field Columns/Lines is required.").Text);
                }
                else {
                    int value;
                    if (!Int32.TryParse(context.ValueProvider.GetValue("Columns").AttemptedValue, out value)) {
                        context.ModelState.AddModelError("Columns", T("The field Columns/Lines must be a valid number.").Text);
                    }
                }
            }
        }
    }
    */

}