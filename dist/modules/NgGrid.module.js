"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var forms_1 = require('@angular/forms');
var main_1 = require('../main');
var NgGridModule = (function () {
    function NgGridModule() {
    }
    NgGridModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, forms_1.FormsModule],
            declarations: [main_1.NgGrid, main_1.NgGridItem, main_1.NgGridPlaceholder],
            entryComponents: [main_1.NgGridPlaceholder],
            exports: [main_1.NgGrid, main_1.NgGridItem]
        }), 
        __metadata('design:paramtypes', [])
    ], NgGridModule);
    return NgGridModule;
}());
exports.NgGridModule = NgGridModule;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZXMvTmdHcmlkLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUJBQThDLGVBQWUsQ0FBQyxDQUFBO0FBQzlELHVCQUE2QixpQkFBaUIsQ0FBQyxDQUFBO0FBQy9DLHNCQUE0QixnQkFBZ0IsQ0FBQyxDQUFBO0FBQzdDLHFCQUF5RixTQUFTLENBQUMsQ0FBQTtBQVFuRztJQUFBO0lBQTJCLENBQUM7SUFONUI7UUFBQyxlQUFRLENBQUM7WUFDUixPQUFPLEVBQVcsQ0FBRSxxQkFBWSxFQUFFLG1CQUFXLENBQUU7WUFDL0MsWUFBWSxFQUFNLENBQUUsYUFBTSxFQUFFLGlCQUFVLEVBQUUsd0JBQWlCLENBQUU7WUFDM0QsZUFBZSxFQUFHLENBQUUsd0JBQWlCLENBQUU7WUFDdkMsT0FBTyxFQUFXLENBQUUsYUFBTSxFQUFFLGlCQUFVLENBQUU7U0FDekMsQ0FBQzs7b0JBQUE7SUFDeUIsbUJBQUM7QUFBRCxDQUEzQixBQUE0QixJQUFBO0FBQWYsb0JBQVksZUFBRyxDQUFBIiwiZmlsZSI6Im1vZHVsZXMvTmdHcmlkLm1vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBOZ0dyaWQsIE5nR3JpZEl0ZW0sIE5nR3JpZEl0ZW1Db25maWcsIE5nR3JpZEl0ZW1FdmVudCwgTmdHcmlkUGxhY2Vob2xkZXIgfSBmcm9tICcuLi9tYWluJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogICAgICAgICAgWyBDb21tb25Nb2R1bGUsIEZvcm1zTW9kdWxlIF0sXG4gIGRlY2xhcmF0aW9uczogICAgIFsgTmdHcmlkLCBOZ0dyaWRJdGVtLCBOZ0dyaWRQbGFjZWhvbGRlciBdLFxuICBlbnRyeUNvbXBvbmVudHM6ICBbIE5nR3JpZFBsYWNlaG9sZGVyIF0sXG4gIGV4cG9ydHM6ICAgICAgICAgIFsgTmdHcmlkLCBOZ0dyaWRJdGVtIF1cbn0pXG5leHBvcnQgY2xhc3MgTmdHcmlkTW9kdWxlIHt9Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
