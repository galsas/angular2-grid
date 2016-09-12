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
var NgGrid_1 = require('./NgGrid');
var core_1 = require('@angular/core');
var NgGridItem = (function () {
    //	Constructor
    function NgGridItem(_differs, _ngEl, _renderer, _ngGrid, containerRef) {
        this._differs = _differs;
        this._ngEl = _ngEl;
        this._renderer = _renderer;
        this._ngGrid = _ngGrid;
        this.containerRef = containerRef;
        //	Event Emitters
        this.onItemChange = new core_1.EventEmitter(false);
        this.onDragStart = new core_1.EventEmitter();
        this.onDrag = new core_1.EventEmitter();
        this.onDragStop = new core_1.EventEmitter();
        this.onDragAny = new core_1.EventEmitter();
        this.onResizeStart = new core_1.EventEmitter();
        this.onResize = new core_1.EventEmitter();
        this.onResizeStop = new core_1.EventEmitter();
        this.onResizeAny = new core_1.EventEmitter();
        this.onChangeStart = new core_1.EventEmitter();
        this.onChange = new core_1.EventEmitter();
        this.onChangeStop = new core_1.EventEmitter();
        this.onChangeAny = new core_1.EventEmitter();
        this.ngGridItemChange = new core_1.EventEmitter();
        this.isFixed = false;
        this.isDraggable = true;
        this.isResizable = true;
        this.minWidth = 0;
        this.minHeight = 0;
        this._position = { col: 1, row: 1 };
        this._currentPosition = { col: 1, row: 1 };
        this._size = { x: 1, y: 1 };
        this._config = NgGridItem.CONST_DEFAULT_CONFIG;
        this._added = false;
        this._maxCols = 0;
        this._minCols = 0;
        this._maxRows = 0;
        this._minRows = 0;
    }
    Object.defineProperty(NgGridItem.prototype, "config", {
        //	[ng-grid-item] handler
        set: function (v) {
            var defaults = NgGridItem.CONST_DEFAULT_CONFIG;
            for (var x in defaults)
                if (v[x] == null)
                    v[x] = defaults[x];
            this.setConfig(v);
            if (this._differ == null && v != null) {
                this._differ = this._differs.find(this._config).create(null);
            }
            if (!this._added) {
                this._added = true;
                this._ngGrid.addItem(this);
            }
            this._recalculateDimensions();
            this._recalculatePosition();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgGridItem.prototype, "sizex", {
        get: function () {
            return this._size.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgGridItem.prototype, "sizey", {
        get: function () {
            return this._size.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgGridItem.prototype, "col", {
        get: function () {
            return this._position.col;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgGridItem.prototype, "row", {
        get: function () {
            return this._position.row;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgGridItem.prototype, "currentCol", {
        get: function () {
            return this._currentPosition.col;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgGridItem.prototype, "currentRow", {
        get: function () {
            return this._currentPosition.row;
        },
        enumerable: true,
        configurable: true
    });
    NgGridItem.prototype.onResizeStartEvent = function () {
        var event = this.getEventOutput();
        this.onResizeStart.emit(event);
        this.onResizeAny.emit(event);
        this.onChangeStart.emit(event);
        this.onChangeAny.emit(event);
    };
    NgGridItem.prototype.onResizeEvent = function () {
        var event = this.getEventOutput();
        this.onResize.emit(event);
        this.onResizeAny.emit(event);
        this.onChange.emit(event);
        this.onChangeAny.emit(event);
    };
    NgGridItem.prototype.onResizeStopEvent = function () {
        var event = this.getEventOutput();
        this.onResizeStop.emit(event);
        this.onResizeAny.emit(event);
        this.onChangeStop.emit(event);
        this.onChangeAny.emit(event);
        this._config.sizex = this._size.x;
        this._config.sizey = this._size.y;
        this.ngGridItemChange.emit(this._config);
    };
    NgGridItem.prototype.onDragStartEvent = function () {
        var event = this.getEventOutput();
        this.onDragStart.emit(event);
        this.onDragAny.emit(event);
        this.onChangeStart.emit(event);
        this.onChangeAny.emit(event);
    };
    NgGridItem.prototype.onDragEvent = function () {
        var event = this.getEventOutput();
        this.onDrag.emit(event);
        this.onDragAny.emit(event);
        this.onChange.emit(event);
        this.onChangeAny.emit(event);
    };
    NgGridItem.prototype.onDragStopEvent = function () {
        var event = this.getEventOutput();
        this.onDragStop.emit(event);
        this.onDragAny.emit(event);
        this.onChangeStop.emit(event);
        this.onChangeAny.emit(event);
        this._config.col = this._position.col;
        this._config.row = this._position.row;
        this.ngGridItemChange.emit(this._config);
    };
    NgGridItem.prototype.onCascadeEvent = function () {
        this._config.sizex = this._size.x;
        this._config.sizey = this._size.y;
        this._config.col = this._position.col;
        this._config.row = this._position.row;
        this.ngGridItemChange.emit(this._config);
    };
    NgGridItem.prototype.ngOnInit = function () {
        this._renderer.setElementClass(this._ngEl.nativeElement, 'grid-item', true);
        if (this._ngGrid.autoStyle)
            this._renderer.setElementStyle(this._ngEl.nativeElement, 'position', 'absolute');
        this._recalculateDimensions();
        this._recalculatePosition();
        if (!this._added) {
            this._added = true;
            this._ngGrid.addItem(this);
        }
    };
    //	Public methods
    NgGridItem.prototype.canDrag = function (e) {
        if (!this.isDraggable)
            return false;
        if (this._dragHandle) {
            return this.findHandle(this._dragHandle, e.target);
        }
        return true;
    };
    NgGridItem.prototype.findHandle = function (handleSelector, startElement) {
        var targetElem = startElement;
        while (targetElem && targetElem != this._ngEl.nativeElement) {
            if (this.elementMatches(targetElem, handleSelector))
                return true;
            targetElem = targetElem.parentElement;
        }
        return false;
    };
    NgGridItem.prototype.canResize = function (e) {
        if (!this.isResizable)
            return null;
        if (this._resizeHandle) {
            return this.findHandle(this._resizeHandle, e.target) ? 'both' : null;
        }
        var mousePos = this._getMousePosition(e);
        if (mousePos.left < this._elemWidth && mousePos.left > this._elemWidth - this._borderSize
            && mousePos.top < this._elemHeight && mousePos.top > this._elemHeight - this._borderSize) {
            return 'both';
        }
        else if (mousePos.left < this._elemWidth && mousePos.left > this._elemWidth - this._borderSize) {
            return 'width';
        }
        else if (mousePos.top < this._elemHeight && mousePos.top > this._elemHeight - this._borderSize) {
            return 'height';
        }
        return null;
    };
    NgGridItem.prototype.onMouseMove = function (e) {
        if (this._ngGrid.autoStyle) {
            if (this._ngGrid.resizeEnable && !this._resizeHandle && this.isResizable) {
                var mousePos = this._getMousePosition(e);
                if (mousePos.left < this._elemWidth && mousePos.left > this._elemWidth - this._borderSize
                    && mousePos.top < this._elemHeight && mousePos.top > this._elemHeight - this._borderSize) {
                    this._renderer.setElementStyle(this._ngEl.nativeElement, 'cursor', 'nwse-resize');
                }
                else if (mousePos.left < this._elemWidth && mousePos.left > this._elemWidth - this._borderSize) {
                    this._renderer.setElementStyle(this._ngEl.nativeElement, 'cursor', 'ew-resize');
                }
                else if (mousePos.top < this._elemHeight && mousePos.top > this._elemHeight - this._borderSize) {
                    this._renderer.setElementStyle(this._ngEl.nativeElement, 'cursor', 'ns-resize');
                }
                else if (this._ngGrid.dragEnable && this.canDrag(e)) {
                    this._renderer.setElementStyle(this._ngEl.nativeElement, 'cursor', 'move');
                }
                else {
                    this._renderer.setElementStyle(this._ngEl.nativeElement, 'cursor', 'default');
                }
            }
            else if (this._ngGrid.resizeEnable && this.canResize(e)) {
                this._renderer.setElementStyle(this._ngEl.nativeElement, 'cursor', 'nwse-resize');
            }
            else if (this._ngGrid.dragEnable && this.canDrag(e)) {
                this._renderer.setElementStyle(this._ngEl.nativeElement, 'cursor', 'move');
            }
            else {
                this._renderer.setElementStyle(this._ngEl.nativeElement, 'cursor', 'default');
            }
        }
    };
    NgGridItem.prototype.ngOnDestroy = function () {
        if (this._added)
            this._ngGrid.removeItem(this);
    };
    //	Getters
    NgGridItem.prototype.getElement = function () {
        return this._ngEl;
    };
    NgGridItem.prototype.getDragHandle = function () {
        return this._dragHandle;
    };
    NgGridItem.prototype.getResizeHandle = function () {
        return this._resizeHandle;
    };
    NgGridItem.prototype.getDimensions = function () {
        return { 'width': this._elemWidth, 'height': this._elemHeight };
    };
    NgGridItem.prototype.getSize = function () {
        return this._size;
    };
    NgGridItem.prototype.getPosition = function () {
        return { 'left': this._elemLeft, 'top': this._elemTop };
    };
    NgGridItem.prototype.getGridPosition = function () {
        return this._currentPosition;
    };
    NgGridItem.prototype.getSavedPosition = function () {
        return this._position;
    };
    //	Setters
    NgGridItem.prototype.setConfig = function (config) {
        this._config = config;
        this._payload = config.payload;
        this._position.col = this._currentPosition.col = config.col ? config.col : NgGridItem.CONST_DEFAULT_CONFIG.col;
        this._position.row = this._currentPosition.row = config.row ? config.row : NgGridItem.CONST_DEFAULT_CONFIG.row;
        this._size.x = config.sizex ? config.sizex : NgGridItem.CONST_DEFAULT_CONFIG.sizex;
        this._size.y = config.sizey ? config.sizey : NgGridItem.CONST_DEFAULT_CONFIG.sizey;
        this._dragHandle = config.dragHandle;
        this._resizeHandle = config.resizeHandle;
        this._borderSize = config.borderSize;
        this.isDraggable = config.draggable ? true : false;
        this.isResizable = config.resizable ? true : false;
        this.isFixed = config.fixed ? true : false;
        this._maxCols = !isNaN(config.maxCols) && isFinite(config.maxCols) ? config.maxCols : 0;
        this._minCols = !isNaN(config.minCols) && isFinite(config.minCols) ? config.minCols : 0;
        this._maxRows = !isNaN(config.maxRows) && isFinite(config.maxRows) ? config.maxRows : 0;
        this._minRows = !isNaN(config.minRows) && isFinite(config.minRows) ? config.minRows : 0;
        this.minWidth = !isNaN(config.minWidth) && isFinite(config.minWidth) ? config.minWidth : 0;
        this.minHeight = !isNaN(config.minHeight) && isFinite(config.minHeight) ? config.minHeight : 0;
        if (this._minCols > 0 && this._maxCols > 0 && this._minCols > this._maxCols)
            this._minCols = 0;
        if (this._minRows > 0 && this._maxRows > 0 && this._minRows > this._maxRows)
            this._minRows = 0;
        if (this._added) {
            this._ngGrid.updateItem(this);
        }
        this._size = this.fixResize(this._size);
        this._recalculatePosition();
        this._recalculateDimensions();
    };
    NgGridItem.prototype.ngDoCheck = function () {
        if (this._differ != null) {
            var changes = this._differ.diff(this._config);
            if (changes != null) {
                this._applyChanges(changes);
                return true;
            }
        }
        return false;
    };
    NgGridItem.prototype.setSize = function (newSize, update) {
        if (update === void 0) { update = true; }
        newSize = this.fixResize(newSize);
        this._size = newSize;
        if (update)
            this._recalculateDimensions();
        this.onItemChange.emit(this.getEventOutput());
    };
    NgGridItem.prototype.setGridPosition = function (gridPosition, update) {
        if (update === void 0) { update = true; }
        this._currentPosition = gridPosition;
        if (update)
            this._recalculatePosition();
        this.onItemChange.emit(this.getEventOutput());
    };
    NgGridItem.prototype.savePosition = function (newPosition) {
        this._position = newPosition;
        this._currentPosition = newPosition;
        this._recalculatePosition();
        this.onItemChange.emit(this.getEventOutput());
    };
    NgGridItem.prototype.getEventOutput = function () {
        return {
            payload: this._payload,
            col: this._currentPosition.col,
            row: this._currentPosition.row,
            sizex: this._size.x,
            sizey: this._size.y,
            width: this._elemWidth,
            height: this._elemHeight,
            left: this._elemLeft,
            top: this._elemTop
        };
    };
    NgGridItem.prototype.setPosition = function (x, y) {
        switch (this._cascadeMode) {
            case 'up':
            case 'left':
            default:
                this._renderer.setElementStyle(this._ngEl.nativeElement, 'transform', 'translate(' + x + 'px, ' + y + 'px)');
                break;
            case 'right':
                this._renderer.setElementStyle(this._ngEl.nativeElement, 'transform', 'translate(' + -x + 'px, ' + y + 'px)');
                break;
            case 'down':
                this._renderer.setElementStyle(this._ngEl.nativeElement, 'transform', 'translate(' + x + 'px, ' + -y + 'px)');
                break;
        }
        this._elemLeft = x;
        this._elemTop = y;
    };
    NgGridItem.prototype.setCascadeMode = function (cascade) {
        this._cascadeMode = cascade;
        switch (cascade) {
            case 'up':
            case 'left':
            default:
                this._renderer.setElementStyle(this._ngEl.nativeElement, 'left', '0px');
                this._renderer.setElementStyle(this._ngEl.nativeElement, 'top', '0px');
                this._renderer.setElementStyle(this._ngEl.nativeElement, 'right', null);
                this._renderer.setElementStyle(this._ngEl.nativeElement, 'bottom', null);
                break;
            case 'right':
                this._renderer.setElementStyle(this._ngEl.nativeElement, 'right', '0px');
                this._renderer.setElementStyle(this._ngEl.nativeElement, 'top', '0px');
                this._renderer.setElementStyle(this._ngEl.nativeElement, 'left', null);
                this._renderer.setElementStyle(this._ngEl.nativeElement, 'bottom', null);
                break;
            case 'down':
                this._renderer.setElementStyle(this._ngEl.nativeElement, 'left', '0px');
                this._renderer.setElementStyle(this._ngEl.nativeElement, 'bottom', '0px');
                this._renderer.setElementStyle(this._ngEl.nativeElement, 'right', null);
                this._renderer.setElementStyle(this._ngEl.nativeElement, 'top', null);
                break;
        }
    };
    NgGridItem.prototype.setDimensions = function (w, h) {
        if (w < this.minWidth)
            w = this.minWidth;
        if (h < this.minHeight)
            h = this.minHeight;
        this._renderer.setElementStyle(this._ngEl.nativeElement, 'width', w + 'px');
        this._renderer.setElementStyle(this._ngEl.nativeElement, 'height', h + 'px');
        this._elemWidth = w;
        this._elemHeight = h;
    };
    NgGridItem.prototype.startMoving = function () {
        this._renderer.setElementClass(this._ngEl.nativeElement, 'moving', true);
        var style = window.getComputedStyle(this._ngEl.nativeElement);
        if (this._ngGrid.autoStyle)
            this._renderer.setElementStyle(this._ngEl.nativeElement, 'z-index', (parseInt(style.getPropertyValue('z-index')) + 1).toString());
    };
    NgGridItem.prototype.stopMoving = function () {
        this._renderer.setElementClass(this._ngEl.nativeElement, 'moving', false);
        var style = window.getComputedStyle(this._ngEl.nativeElement);
        if (this._ngGrid.autoStyle)
            this._renderer.setElementStyle(this._ngEl.nativeElement, 'z-index', (parseInt(style.getPropertyValue('z-index')) - 1).toString());
    };
    NgGridItem.prototype.recalculateSelf = function () {
        this._recalculatePosition();
        this._recalculateDimensions();
    };
    NgGridItem.prototype.fixResize = function (newSize) {
        if (this._maxCols > 0 && newSize.x > this._maxCols)
            newSize.x = this._maxCols;
        if (this._maxRows > 0 && newSize.y > this._maxRows)
            newSize.y = this._maxRows;
        if (this._minCols > 0 && newSize.x < this._minCols)
            newSize.x = this._minCols;
        if (this._minRows > 0 && newSize.y < this._minRows)
            newSize.y = this._minRows;
        var itemWidth = (newSize.x * this._ngGrid.colWidth) + ((this._ngGrid.marginLeft + this._ngGrid.marginRight) * (newSize.x - 1));
        if (itemWidth < this.minWidth)
            newSize.x = Math.ceil((this.minWidth + this._ngGrid.marginRight + this._ngGrid.marginLeft) / (this._ngGrid.colWidth + this._ngGrid.marginRight + this._ngGrid.marginLeft));
        var itemHeight = (newSize.y * this._ngGrid.rowHeight) + ((this._ngGrid.marginTop + this._ngGrid.marginBottom) * (newSize.y - 1));
        if (itemHeight < this.minHeight)
            newSize.y = Math.ceil((this.minHeight + this._ngGrid.marginBottom + this._ngGrid.marginTop) / (this._ngGrid.rowHeight + this._ngGrid.marginBottom + this._ngGrid.marginTop));
        return newSize;
    };
    //	Private methods
    NgGridItem.prototype.elementMatches = function (element, selector) {
        if (element.matches)
            return element.matches(selector);
        if (element.oMatchesSelector)
            return element.oMatchesSelector(selector);
        if (element.msMatchesSelector)
            return element.msMatchesSelector(selector);
        if (element.mozMatchesSelector)
            return element.mozMatchesSelector(selector);
        if (element.webkitMatchesSelector)
            return element.webkitMatchesSelector(selector);
        var matches = (element.document || element.ownerDocument).querySelectorAll(selector);
        var i = matches.length;
        while (--i >= 0 && matches.item(i) !== element) { }
        return i > -1;
    };
    NgGridItem.prototype._recalculatePosition = function () {
        var x = (this._ngGrid.colWidth + this._ngGrid.marginLeft + this._ngGrid.marginRight) * (this._currentPosition.col - 1) + this._ngGrid.marginLeft;
        var y = (this._ngGrid.rowHeight + this._ngGrid.marginTop + this._ngGrid.marginBottom) * (this._currentPosition.row - 1) + this._ngGrid.marginTop;
        this.setPosition(x, y);
    };
    NgGridItem.prototype._recalculateDimensions = function () {
        if (this._size.x < this._ngGrid.minCols)
            this._size.x = this._ngGrid.minCols;
        if (this._size.y < this._ngGrid.minRows)
            this._size.y = this._ngGrid.minRows;
        var newWidth = (this._ngGrid.colWidth * this._size.x) + ((this._ngGrid.marginLeft + this._ngGrid.marginRight) * (this._size.x - 1));
        var newHeight = (this._ngGrid.rowHeight * this._size.y) + ((this._ngGrid.marginTop + this._ngGrid.marginBottom) * (this._size.y - 1));
        var w = Math.max(this.minWidth, this._ngGrid.minWidth, newWidth);
        var h = Math.max(this.minHeight, this._ngGrid.minHeight, newHeight);
        this.setDimensions(w, h);
    };
    NgGridItem.prototype._getMousePosition = function (e) {
        if (e.originalEvent && e.originalEvent.touches) {
            var oe = e.originalEvent;
            e = oe.touches.length ? oe.touches[0] : oe.changedTouches[0];
        }
        var refPos = this._ngEl.nativeElement.getBoundingClientRect();
        return {
            left: e.clientX - refPos.left,
            top: e.clientY - refPos.top
        };
    };
    NgGridItem.prototype._applyChanges = function (changes) {
        var _this = this;
        changes.forEachAddedItem(function (record) { _this._config[record.key] = record.currentValue; });
        changes.forEachChangedItem(function (record) { _this._config[record.key] = record.currentValue; });
        changes.forEachRemovedItem(function (record) { delete _this._config[record.key]; });
        this.setConfig(this._config);
    };
    //	Default config
    NgGridItem.CONST_DEFAULT_CONFIG = {
        col: 1,
        row: 1,
        sizex: 1,
        sizey: 1,
        dragHandle: null,
        resizeHandle: null,
        fixed: false,
        draggable: true,
        resizable: true,
        borderSize: 15
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGridItem.prototype, "onItemChange", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGridItem.prototype, "onDragStart", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGridItem.prototype, "onDrag", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGridItem.prototype, "onDragStop", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGridItem.prototype, "onDragAny", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGridItem.prototype, "onResizeStart", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGridItem.prototype, "onResize", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGridItem.prototype, "onResizeStop", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGridItem.prototype, "onResizeAny", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGridItem.prototype, "onChangeStart", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGridItem.prototype, "onChange", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGridItem.prototype, "onChangeStop", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGridItem.prototype, "onChangeAny", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGridItem.prototype, "ngGridItemChange", void 0);
    NgGridItem = __decorate([
        core_1.Directive({
            selector: '[ngGridItem]',
            inputs: ['config: ngGridItem']
        }), 
        __metadata('design:paramtypes', [core_1.KeyValueDiffers, core_1.ElementRef, core_1.Renderer, NgGrid_1.NgGrid, core_1.ViewContainerRef])
    ], NgGridItem);
    return NgGridItem;
}());
exports.NgGridItem = NgGridItem;

//# sourceMappingURL=data:application/json;base64,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QUFHLElBQUksR0FBRyxLQUFLLENBQUM7UUFFM0MsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxNQUFNLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztRQUN4RixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQ3hGLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsTUFBTSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7UUFDeEYsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxNQUFNLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztRQUV4RixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQzNGLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsTUFBTSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7UUFFL0YsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFD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QUFDLGFBQU0sRUFBRTs7Z0RBQUE7SUFDVDtRQUFDLGFBQU0sRUFBRTs7b0RBQUE7SUFDVDtRQUFDLGFBQU0sRUFBRTs7bURBQUE7SUFDVDtRQUFDLGFBQU0sRUFBRTs7d0RBQUE7SUFuQlY7UUFBQyxnQkFBUyxDQUFDO1lBQ1YsUUFBUSxFQUFFLGNBQWM7WUFDeEIsTUFBTSxFQUFFLENBQUMsb0JBQW9CLENBQUM7U0FDOUIsQ0FBQzs7a0JBQUE7SUF3Z0JGLGlCQUFDO0FBQUQsQ0F2Z0JBLEFBdWdCQyxJQUFBO0FBdmdCWSxrQkFBVSxhQXVnQnRCLENBQUEiLCJmaWxlIjoiZGlyZWN0aXZlcy9OZ0dyaWRJdGVtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdHcmlkIH0gZnJvbSAnLi9OZ0dyaWQnO1xyXG5pbXBvcnQgeyBOZ0dyaWRJdGVtQ29uZmlnLCBOZ0dyaWRJdGVtRXZlbnQsIE5nR3JpZEl0ZW1Qb3NpdGlvbiwgTmdHcmlkSXRlbVNpemUsIE5nR3JpZFJhd1Bvc2l0aW9uLCBOZ0dyaWRJdGVtRGltZW5zaW9ucyB9IGZyb20gJy4uL2ludGVyZmFjZXMvSU5nR3JpZCc7XHJcbmltcG9ydCB7IENvbXBvbmVudCwgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBSZW5kZXJlciwgRXZlbnRFbWl0dGVyLCBIb3N0LCBWaWV3RW5jYXBzdWxhdGlvbiwgVHlwZSwgQ29tcG9uZW50UmVmLCBLZXlWYWx1ZURpZmZlciwgS2V5VmFsdWVEaWZmZXJzLCBPbkluaXQsIE9uRGVzdHJveSwgRG9DaGVjaywgVmlld0NvbnRhaW5lclJlZiwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5ARGlyZWN0aXZlKHtcclxuXHRzZWxlY3RvcjogJ1tuZ0dyaWRJdGVtXScsXHJcblx0aW5wdXRzOiBbJ2NvbmZpZzogbmdHcmlkSXRlbSddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZ0dyaWRJdGVtIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xyXG5cdC8vXHRFdmVudCBFbWl0dGVyc1xyXG5cdEBPdXRwdXQoKSBwdWJsaWMgb25JdGVtQ2hhbmdlOiBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbUV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbUV2ZW50PihmYWxzZSk7XHJcblx0QE91dHB1dCgpIHB1YmxpYyBvbkRyYWdTdGFydDogRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW1FdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW1FdmVudD4oKTtcclxuXHRAT3V0cHV0KCkgcHVibGljIG9uRHJhZzogRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW1FdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW1FdmVudD4oKTtcclxuXHRAT3V0cHV0KCkgcHVibGljIG9uRHJhZ1N0b3A6IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtRXZlbnQ+KCk7XHJcblx0QE91dHB1dCgpIHB1YmxpYyBvbkRyYWdBbnk6IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtRXZlbnQ+KCk7XHJcblx0QE91dHB1dCgpIHB1YmxpYyBvblJlc2l6ZVN0YXJ0OiBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbUV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbUV2ZW50PigpO1xyXG5cdEBPdXRwdXQoKSBwdWJsaWMgb25SZXNpemU6IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtRXZlbnQ+KCk7XHJcblx0QE91dHB1dCgpIHB1YmxpYyBvblJlc2l6ZVN0b3A6IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtRXZlbnQ+KCk7XHJcblx0QE91dHB1dCgpIHB1YmxpYyBvblJlc2l6ZUFueTogRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW1FdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW1FdmVudD4oKTtcclxuXHRAT3V0cHV0KCkgcHVibGljIG9uQ2hhbmdlU3RhcnQ6IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtRXZlbnQ+KCk7XHJcblx0QE91dHB1dCgpIHB1YmxpYyBvbkNoYW5nZTogRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW1FdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW1FdmVudD4oKTtcclxuXHRAT3V0cHV0KCkgcHVibGljIG9uQ2hhbmdlU3RvcDogRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW1FdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW1FdmVudD4oKTtcclxuXHRAT3V0cHV0KCkgcHVibGljIG9uQ2hhbmdlQW55OiBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbUV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbUV2ZW50PigpO1xyXG5cdEBPdXRwdXQoKSBwdWJsaWMgbmdHcmlkSXRlbUNoYW5nZTogRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW1Db25maWc+ID0gbmV3IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtQ29uZmlnPigpO1xyXG5cclxuXHQvL1x0RGVmYXVsdCBjb25maWdcclxuXHRwcml2YXRlIHN0YXRpYyBDT05TVF9ERUZBVUxUX0NPTkZJRzogTmdHcmlkSXRlbUNvbmZpZyA9IHtcclxuXHRcdGNvbDogMSxcclxuXHRcdHJvdzogMSxcclxuXHRcdHNpemV4OiAxLFxyXG5cdFx0c2l6ZXk6IDEsXHJcblx0XHRkcmFnSGFuZGxlOiBudWxsLFxyXG5cdFx0cmVzaXplSGFuZGxlOiBudWxsLFxyXG5cdFx0Zml4ZWQ6IGZhbHNlLFxyXG5cdFx0ZHJhZ2dhYmxlOiB0cnVlLFxyXG5cdFx0cmVzaXphYmxlOiB0cnVlLFxyXG5cdFx0Ym9yZGVyU2l6ZTogMTVcclxuXHR9O1xyXG5cclxuXHRwdWJsaWMgaXNGaXhlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdHB1YmxpYyBpc0RyYWdnYWJsZTogYm9vbGVhbiA9IHRydWU7XHJcblx0cHVibGljIGlzUmVzaXphYmxlOiBib29sZWFuID0gdHJ1ZTtcclxuXHRwdWJsaWMgbWluV2lkdGg6IG51bWJlciA9IDA7XHJcblx0cHVibGljIG1pbkhlaWdodDogbnVtYmVyID0gMDtcclxuXHJcblx0Ly9cdFByaXZhdGUgdmFyaWFibGVzXHJcblx0cHJpdmF0ZSBfcGF5bG9hZDogYW55O1xyXG5cdHByaXZhdGUgX3Bvc2l0aW9uOiBOZ0dyaWRJdGVtUG9zaXRpb24gPSB7IGNvbDogMSwgcm93OiAxIH07XHJcblx0cHJpdmF0ZSBfY3VycmVudFBvc2l0aW9uOiBOZ0dyaWRJdGVtUG9zaXRpb24gPSB7IGNvbDogMSwgcm93OiAxIH07XHJcblx0cHJpdmF0ZSBfc2l6ZTogTmdHcmlkSXRlbVNpemUgPSB7IHg6IDEsIHk6IDEgfTtcclxuXHRwcml2YXRlIF9jb25maWcgPSBOZ0dyaWRJdGVtLkNPTlNUX0RFRkFVTFRfQ09ORklHO1xyXG5cdHByaXZhdGUgX2RyYWdIYW5kbGU6IHN0cmluZztcclxuXHRwcml2YXRlIF9yZXNpemVIYW5kbGU6IHN0cmluZztcclxuXHRwcml2YXRlIF9ib3JkZXJTaXplOiBudW1iZXI7XHJcblx0cHJpdmF0ZSBfZWxlbVdpZHRoOiBudW1iZXI7XHJcblx0cHJpdmF0ZSBfZWxlbUhlaWdodDogbnVtYmVyO1xyXG5cdHByaXZhdGUgX2VsZW1MZWZ0OiBudW1iZXI7XHJcblx0cHJpdmF0ZSBfZWxlbVRvcDogbnVtYmVyO1xyXG5cdHByaXZhdGUgX2FkZGVkOiBib29sZWFuID0gZmFsc2U7XHJcblx0cHJpdmF0ZSBfZGlmZmVyOiBLZXlWYWx1ZURpZmZlcjtcclxuXHRwcml2YXRlIF9jYXNjYWRlTW9kZTogc3RyaW5nO1xyXG5cdHByaXZhdGUgX21heENvbHM6IG51bWJlciA9IDA7XHJcblx0cHJpdmF0ZSBfbWluQ29sczogbnVtYmVyID0gMDtcclxuXHRwcml2YXRlIF9tYXhSb3dzOiBudW1iZXIgPSAwO1xyXG5cdHByaXZhdGUgX21pblJvd3M6IG51bWJlciA9IDA7XHJcblxyXG5cdC8vXHRbbmctZ3JpZC1pdGVtXSBoYW5kbGVyXHJcblx0c2V0IGNvbmZpZyh2OiBOZ0dyaWRJdGVtQ29uZmlnKSB7XHJcblx0XHRjb25zdCBkZWZhdWx0cyA9IE5nR3JpZEl0ZW0uQ09OU1RfREVGQVVMVF9DT05GSUc7XHJcblxyXG5cdFx0Zm9yIChsZXQgeCBpbiBkZWZhdWx0cylcclxuXHRcdFx0aWYgKHZbeF0gPT0gbnVsbClcclxuXHRcdFx0XHR2W3hdID0gZGVmYXVsdHNbeF07XHJcblxyXG5cdFx0dGhpcy5zZXRDb25maWcodik7XHJcblxyXG5cdFx0aWYgKHRoaXMuX2RpZmZlciA9PSBudWxsICYmIHYgIT0gbnVsbCkge1xyXG5cdFx0XHR0aGlzLl9kaWZmZXIgPSB0aGlzLl9kaWZmZXJzLmZpbmQodGhpcy5fY29uZmlnKS5jcmVhdGUobnVsbCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCF0aGlzLl9hZGRlZCkge1xyXG5cdFx0XHR0aGlzLl9hZGRlZCA9IHRydWU7XHJcblx0XHRcdHRoaXMuX25nR3JpZC5hZGRJdGVtKHRoaXMpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX3JlY2FsY3VsYXRlRGltZW5zaW9ucygpO1xyXG5cdFx0dGhpcy5fcmVjYWxjdWxhdGVQb3NpdGlvbigpO1xyXG5cdH1cclxuXHJcblx0Z2V0IHNpemV4KCk6IG51bWJlciB7XHJcblx0XHRyZXR1cm4gdGhpcy5fc2l6ZS54O1xyXG5cdH1cclxuXHJcblx0Z2V0IHNpemV5KCk6IG51bWJlciB7XHJcblx0XHRyZXR1cm4gdGhpcy5fc2l6ZS55O1xyXG5cdH1cclxuXHJcblx0Z2V0IGNvbCgpOiBudW1iZXIge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3Bvc2l0aW9uLmNvbDtcclxuXHR9XHJcblxyXG5cdGdldCByb3coKTogbnVtYmVyIHtcclxuXHRcdHJldHVybiB0aGlzLl9wb3NpdGlvbi5yb3c7XHJcblx0fVxyXG5cclxuXHRnZXQgY3VycmVudENvbCgpOiBudW1iZXIge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2N1cnJlbnRQb3NpdGlvbi5jb2w7XHJcblx0fVxyXG5cclxuXHRnZXQgY3VycmVudFJvdygpOiBudW1iZXIge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2N1cnJlbnRQb3NpdGlvbi5yb3c7XHJcblx0fVxyXG5cclxuXHQvL1x0Q29uc3RydWN0b3JcclxuXHRjb25zdHJ1Y3Rvcihwcml2YXRlIF9kaWZmZXJzOiBLZXlWYWx1ZURpZmZlcnMsIHByaXZhdGUgX25nRWw6IEVsZW1lbnRSZWYsIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlciwgcHJpdmF0ZSBfbmdHcmlkOiBOZ0dyaWQsIHB1YmxpYyBjb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYpIHsgfVxyXG5cclxuXHRwdWJsaWMgb25SZXNpemVTdGFydEV2ZW50KCk6IHZvaWQge1xyXG5cdFx0Y29uc3QgZXZlbnQ6IE5nR3JpZEl0ZW1FdmVudCA9IHRoaXMuZ2V0RXZlbnRPdXRwdXQoKTtcclxuXHRcdHRoaXMub25SZXNpemVTdGFydC5lbWl0KGV2ZW50KTtcclxuXHRcdHRoaXMub25SZXNpemVBbnkuZW1pdChldmVudCk7XHJcblx0XHR0aGlzLm9uQ2hhbmdlU3RhcnQuZW1pdChldmVudCk7XHJcblx0XHR0aGlzLm9uQ2hhbmdlQW55LmVtaXQoZXZlbnQpO1xyXG5cdH1cclxuXHRwdWJsaWMgb25SZXNpemVFdmVudCgpOiB2b2lkIHtcclxuXHRcdGNvbnN0IGV2ZW50OiBOZ0dyaWRJdGVtRXZlbnQgPSB0aGlzLmdldEV2ZW50T3V0cHV0KCk7XHJcblx0XHR0aGlzLm9uUmVzaXplLmVtaXQoZXZlbnQpO1xyXG5cdFx0dGhpcy5vblJlc2l6ZUFueS5lbWl0KGV2ZW50KTtcclxuXHRcdHRoaXMub25DaGFuZ2UuZW1pdChldmVudCk7XHJcblx0XHR0aGlzLm9uQ2hhbmdlQW55LmVtaXQoZXZlbnQpO1xyXG5cdH1cclxuXHRwdWJsaWMgb25SZXNpemVTdG9wRXZlbnQoKTogdm9pZCB7XHJcblx0XHRjb25zdCBldmVudDogTmdHcmlkSXRlbUV2ZW50ID0gdGhpcy5nZXRFdmVudE91dHB1dCgpO1xyXG5cdFx0dGhpcy5vblJlc2l6ZVN0b3AuZW1pdChldmVudCk7XHJcblx0XHR0aGlzLm9uUmVzaXplQW55LmVtaXQoZXZlbnQpO1xyXG5cdFx0dGhpcy5vbkNoYW5nZVN0b3AuZW1pdChldmVudCk7XHJcblx0XHR0aGlzLm9uQ2hhbmdlQW55LmVtaXQoZXZlbnQpO1xyXG5cclxuXHRcdHRoaXMuX2NvbmZpZy5zaXpleCA9IHRoaXMuX3NpemUueDtcclxuXHRcdHRoaXMuX2NvbmZpZy5zaXpleSA9IHRoaXMuX3NpemUueTtcclxuXHRcdHRoaXMubmdHcmlkSXRlbUNoYW5nZS5lbWl0KHRoaXMuX2NvbmZpZyk7XHJcblx0fVxyXG5cdHB1YmxpYyBvbkRyYWdTdGFydEV2ZW50KCk6IHZvaWQge1xyXG5cdFx0Y29uc3QgZXZlbnQ6IE5nR3JpZEl0ZW1FdmVudCA9IHRoaXMuZ2V0RXZlbnRPdXRwdXQoKTtcclxuXHRcdHRoaXMub25EcmFnU3RhcnQuZW1pdChldmVudCk7XHJcblx0XHR0aGlzLm9uRHJhZ0FueS5lbWl0KGV2ZW50KTtcclxuXHRcdHRoaXMub25DaGFuZ2VTdGFydC5lbWl0KGV2ZW50KTtcclxuXHRcdHRoaXMub25DaGFuZ2VBbnkuZW1pdChldmVudCk7XHJcblx0fVxyXG5cdHB1YmxpYyBvbkRyYWdFdmVudCgpOiB2b2lkIHtcclxuXHRcdGNvbnN0IGV2ZW50OiBOZ0dyaWRJdGVtRXZlbnQgPSB0aGlzLmdldEV2ZW50T3V0cHV0KCk7XHJcblx0XHR0aGlzLm9uRHJhZy5lbWl0KGV2ZW50KTtcclxuXHRcdHRoaXMub25EcmFnQW55LmVtaXQoZXZlbnQpO1xyXG5cdFx0dGhpcy5vbkNoYW5nZS5lbWl0KGV2ZW50KTtcclxuXHRcdHRoaXMub25DaGFuZ2VBbnkuZW1pdChldmVudCk7XHJcblx0fVxyXG5cdHB1YmxpYyBvbkRyYWdTdG9wRXZlbnQoKTogdm9pZCB7XHJcblx0XHRjb25zdCBldmVudDogTmdHcmlkSXRlbUV2ZW50ID0gdGhpcy5nZXRFdmVudE91dHB1dCgpO1xyXG5cdFx0dGhpcy5vbkRyYWdTdG9wLmVtaXQoZXZlbnQpO1xyXG5cdFx0dGhpcy5vbkRyYWdBbnkuZW1pdChldmVudCk7XHJcblx0XHR0aGlzLm9uQ2hhbmdlU3RvcC5lbWl0KGV2ZW50KTtcclxuXHRcdHRoaXMub25DaGFuZ2VBbnkuZW1pdChldmVudCk7XHJcblxyXG5cdFx0dGhpcy5fY29uZmlnLmNvbCA9IHRoaXMuX3Bvc2l0aW9uLmNvbDtcclxuXHRcdHRoaXMuX2NvbmZpZy5yb3cgPSB0aGlzLl9wb3NpdGlvbi5yb3c7XHJcblx0XHR0aGlzLm5nR3JpZEl0ZW1DaGFuZ2UuZW1pdCh0aGlzLl9jb25maWcpO1xyXG5cdH1cclxuXHRwdWJsaWMgb25DYXNjYWRlRXZlbnQoKTogdm9pZCB7XHJcblx0XHR0aGlzLl9jb25maWcuc2l6ZXggPSB0aGlzLl9zaXplLng7XHJcblx0XHR0aGlzLl9jb25maWcuc2l6ZXkgPSB0aGlzLl9zaXplLnk7XHJcblx0XHR0aGlzLl9jb25maWcuY29sID0gdGhpcy5fcG9zaXRpb24uY29sO1xyXG5cdFx0dGhpcy5fY29uZmlnLnJvdyA9IHRoaXMuX3Bvc2l0aW9uLnJvdztcclxuXHRcdHRoaXMubmdHcmlkSXRlbUNoYW5nZS5lbWl0KHRoaXMuX2NvbmZpZyk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XHJcblx0XHR0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3ModGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAnZ3JpZC1pdGVtJywgdHJ1ZSk7XHJcblx0XHRpZiAodGhpcy5fbmdHcmlkLmF1dG9TdHlsZSkgdGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCwgJ3Bvc2l0aW9uJywgJ2Fic29sdXRlJyk7XHJcblx0XHR0aGlzLl9yZWNhbGN1bGF0ZURpbWVuc2lvbnMoKTtcclxuXHRcdHRoaXMuX3JlY2FsY3VsYXRlUG9zaXRpb24oKTtcclxuXHJcblx0XHRpZiAoIXRoaXMuX2FkZGVkKSB7XHJcblx0XHRcdHRoaXMuX2FkZGVkID0gdHJ1ZTtcclxuXHRcdFx0dGhpcy5fbmdHcmlkLmFkZEl0ZW0odGhpcyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvL1x0UHVibGljIG1ldGhvZHNcclxuXHRwdWJsaWMgY2FuRHJhZyhlOiBhbnkpOiBib29sZWFuIHtcclxuXHRcdGlmICghdGhpcy5pc0RyYWdnYWJsZSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdGlmICh0aGlzLl9kcmFnSGFuZGxlKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmZpbmRIYW5kbGUodGhpcy5fZHJhZ0hhbmRsZSwgZS50YXJnZXQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGZpbmRIYW5kbGUoaGFuZGxlU2VsZWN0b3I6IHN0cmluZywgc3RhcnRFbGVtZW50OiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xyXG5cdFx0bGV0IHRhcmdldEVsZW06IGFueSA9IHN0YXJ0RWxlbWVudDtcclxuXHJcblx0XHR3aGlsZSAodGFyZ2V0RWxlbSAmJiB0YXJnZXRFbGVtICE9IHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCkge1xyXG5cdFx0XHRpZiAodGhpcy5lbGVtZW50TWF0Y2hlcyh0YXJnZXRFbGVtLCBoYW5kbGVTZWxlY3RvcikpIHJldHVybiB0cnVlO1xyXG5cclxuXHRcdFx0dGFyZ2V0RWxlbSA9IHRhcmdldEVsZW0ucGFyZW50RWxlbWVudDtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgY2FuUmVzaXplKGU6IGFueSk6IHN0cmluZyB7XHJcblx0XHRpZiAoIXRoaXMuaXNSZXNpemFibGUpIHJldHVybiBudWxsO1xyXG5cclxuXHRcdGlmICh0aGlzLl9yZXNpemVIYW5kbGUpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuZmluZEhhbmRsZSh0aGlzLl9yZXNpemVIYW5kbGUsIGUudGFyZ2V0KSA/ICdib3RoJyA6IG51bGw7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgbW91c2VQb3M6IE5nR3JpZFJhd1Bvc2l0aW9uID0gdGhpcy5fZ2V0TW91c2VQb3NpdGlvbihlKTtcclxuXHJcblx0XHRpZiAobW91c2VQb3MubGVmdCA8IHRoaXMuX2VsZW1XaWR0aCAmJiBtb3VzZVBvcy5sZWZ0ID4gdGhpcy5fZWxlbVdpZHRoIC0gdGhpcy5fYm9yZGVyU2l6ZVxyXG5cdFx0XHQmJiBtb3VzZVBvcy50b3AgPCB0aGlzLl9lbGVtSGVpZ2h0ICYmIG1vdXNlUG9zLnRvcCA+IHRoaXMuX2VsZW1IZWlnaHQgLSB0aGlzLl9ib3JkZXJTaXplKSB7XHJcblx0XHRcdHJldHVybiAnYm90aCc7XHJcblx0XHR9IGVsc2UgaWYgKG1vdXNlUG9zLmxlZnQgPCB0aGlzLl9lbGVtV2lkdGggJiYgbW91c2VQb3MubGVmdCA+IHRoaXMuX2VsZW1XaWR0aCAtIHRoaXMuX2JvcmRlclNpemUpIHtcclxuXHRcdFx0cmV0dXJuICd3aWR0aCc7XHJcblx0XHR9IGVsc2UgaWYgKG1vdXNlUG9zLnRvcCA8IHRoaXMuX2VsZW1IZWlnaHQgJiYgbW91c2VQb3MudG9wID4gdGhpcy5fZWxlbUhlaWdodCAtIHRoaXMuX2JvcmRlclNpemUpIHtcclxuXHRcdFx0cmV0dXJuICdoZWlnaHQnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH1cclxuXHJcblx0cHVibGljIG9uTW91c2VNb3ZlKGU6IGFueSk6IHZvaWQge1xyXG5cdFx0aWYgKHRoaXMuX25nR3JpZC5hdXRvU3R5bGUpIHtcclxuXHRcdFx0aWYgKHRoaXMuX25nR3JpZC5yZXNpemVFbmFibGUgJiYgIXRoaXMuX3Jlc2l6ZUhhbmRsZSAmJiB0aGlzLmlzUmVzaXphYmxlKSB7XHJcblx0XHRcdFx0Y29uc3QgbW91c2VQb3M6IE5nR3JpZFJhd1Bvc2l0aW9uID0gdGhpcy5fZ2V0TW91c2VQb3NpdGlvbihlKTtcclxuXHJcblx0XHRcdFx0aWYgKG1vdXNlUG9zLmxlZnQgPCB0aGlzLl9lbGVtV2lkdGggJiYgbW91c2VQb3MubGVmdCA+IHRoaXMuX2VsZW1XaWR0aCAtIHRoaXMuX2JvcmRlclNpemVcclxuXHRcdFx0XHRcdCYmIG1vdXNlUG9zLnRvcCA8IHRoaXMuX2VsZW1IZWlnaHQgJiYgbW91c2VQb3MudG9wID4gdGhpcy5fZWxlbUhlaWdodCAtIHRoaXMuX2JvcmRlclNpemUpIHtcclxuXHRcdFx0XHRcdHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICdjdXJzb3InLCAnbndzZS1yZXNpemUnKTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKG1vdXNlUG9zLmxlZnQgPCB0aGlzLl9lbGVtV2lkdGggJiYgbW91c2VQb3MubGVmdCA+IHRoaXMuX2VsZW1XaWR0aCAtIHRoaXMuX2JvcmRlclNpemUpIHtcclxuXHRcdFx0XHRcdHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICdjdXJzb3InLCAnZXctcmVzaXplJyk7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChtb3VzZVBvcy50b3AgPCB0aGlzLl9lbGVtSGVpZ2h0ICYmIG1vdXNlUG9zLnRvcCA+IHRoaXMuX2VsZW1IZWlnaHQgLSB0aGlzLl9ib3JkZXJTaXplKSB7XHJcblx0XHRcdFx0XHR0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAnY3Vyc29yJywgJ25zLXJlc2l6ZScpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5fbmdHcmlkLmRyYWdFbmFibGUgJiYgdGhpcy5jYW5EcmFnKGUpKSB7XHJcblx0XHRcdFx0XHR0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAnY3Vyc29yJywgJ21vdmUnKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCwgJ2N1cnNvcicsICdkZWZhdWx0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2UgaWYgKHRoaXMuX25nR3JpZC5yZXNpemVFbmFibGUgJiYgdGhpcy5jYW5SZXNpemUoZSkpIHtcclxuXHRcdFx0XHR0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAnY3Vyc29yJywgJ253c2UtcmVzaXplJyk7XHJcblx0XHRcdH0gZWxzZSBpZiAodGhpcy5fbmdHcmlkLmRyYWdFbmFibGUgJiYgdGhpcy5jYW5EcmFnKGUpKSB7XHJcblx0XHRcdFx0dGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCwgJ2N1cnNvcicsICdtb3ZlJyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCwgJ2N1cnNvcicsICdkZWZhdWx0Jyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuXHRcdGlmICh0aGlzLl9hZGRlZCkgdGhpcy5fbmdHcmlkLnJlbW92ZUl0ZW0odGhpcyk7XHJcblx0fVxyXG5cclxuXHQvL1x0R2V0dGVyc1xyXG5cdHB1YmxpYyBnZXRFbGVtZW50KCk6IEVsZW1lbnRSZWYge1xyXG5cdFx0cmV0dXJuIHRoaXMuX25nRWw7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0RHJhZ0hhbmRsZSgpOiBzdHJpbmcge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2RyYWdIYW5kbGU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0UmVzaXplSGFuZGxlKCk6IHN0cmluZyB7XHJcblx0XHRyZXR1cm4gdGhpcy5fcmVzaXplSGFuZGxlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldERpbWVuc2lvbnMoKTogTmdHcmlkSXRlbURpbWVuc2lvbnMge1xyXG5cdFx0cmV0dXJuIHsgJ3dpZHRoJzogdGhpcy5fZWxlbVdpZHRoLCAnaGVpZ2h0JzogdGhpcy5fZWxlbUhlaWdodCB9O1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldFNpemUoKTogTmdHcmlkSXRlbVNpemUge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3NpemU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0UG9zaXRpb24oKTogTmdHcmlkUmF3UG9zaXRpb24ge1xyXG5cdFx0cmV0dXJuIHsgJ2xlZnQnOiB0aGlzLl9lbGVtTGVmdCwgJ3RvcCc6IHRoaXMuX2VsZW1Ub3AgfTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXRHcmlkUG9zaXRpb24oKTogTmdHcmlkSXRlbVBvc2l0aW9uIHtcclxuXHRcdHJldHVybiB0aGlzLl9jdXJyZW50UG9zaXRpb247XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0U2F2ZWRQb3NpdGlvbigpOiBOZ0dyaWRJdGVtUG9zaXRpb24ge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3Bvc2l0aW9uO1xyXG5cdH1cclxuXHJcblx0Ly9cdFNldHRlcnNcclxuXHRwdWJsaWMgc2V0Q29uZmlnKGNvbmZpZzogTmdHcmlkSXRlbUNvbmZpZyk6IHZvaWQge1xyXG5cdFx0dGhpcy5fY29uZmlnID0gY29uZmlnO1xyXG5cclxuXHRcdHRoaXMuX3BheWxvYWQgPSBjb25maWcucGF5bG9hZDtcclxuXHRcdHRoaXMuX3Bvc2l0aW9uLmNvbCA9IHRoaXMuX2N1cnJlbnRQb3NpdGlvbi5jb2wgPSBjb25maWcuY29sID8gY29uZmlnLmNvbCA6IE5nR3JpZEl0ZW0uQ09OU1RfREVGQVVMVF9DT05GSUcuY29sO1xyXG5cdFx0dGhpcy5fcG9zaXRpb24ucm93ID0gdGhpcy5fY3VycmVudFBvc2l0aW9uLnJvdyA9IGNvbmZpZy5yb3cgPyBjb25maWcucm93IDogTmdHcmlkSXRlbS5DT05TVF9ERUZBVUxUX0NPTkZJRy5yb3c7XHJcblx0XHR0aGlzLl9zaXplLnggPSBjb25maWcuc2l6ZXggPyBjb25maWcuc2l6ZXggOiBOZ0dyaWRJdGVtLkNPTlNUX0RFRkFVTFRfQ09ORklHLnNpemV4O1xyXG5cdFx0dGhpcy5fc2l6ZS55ID0gY29uZmlnLnNpemV5ID8gY29uZmlnLnNpemV5IDogTmdHcmlkSXRlbS5DT05TVF9ERUZBVUxUX0NPTkZJRy5zaXpleTtcclxuXHRcdHRoaXMuX2RyYWdIYW5kbGUgPSBjb25maWcuZHJhZ0hhbmRsZTtcclxuXHRcdHRoaXMuX3Jlc2l6ZUhhbmRsZSA9IGNvbmZpZy5yZXNpemVIYW5kbGU7XHJcblx0XHR0aGlzLl9ib3JkZXJTaXplID0gY29uZmlnLmJvcmRlclNpemU7XHJcblx0XHR0aGlzLmlzRHJhZ2dhYmxlID0gY29uZmlnLmRyYWdnYWJsZSA/IHRydWUgOiBmYWxzZTtcclxuXHRcdHRoaXMuaXNSZXNpemFibGUgPSBjb25maWcucmVzaXphYmxlID8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFx0dGhpcy5pc0ZpeGVkID0gY29uZmlnLmZpeGVkID8gdHJ1ZSA6IGZhbHNlO1xyXG5cclxuXHRcdHRoaXMuX21heENvbHMgPSAhaXNOYU4oY29uZmlnLm1heENvbHMpICYmIGlzRmluaXRlKGNvbmZpZy5tYXhDb2xzKSA/IGNvbmZpZy5tYXhDb2xzIDogMDtcclxuXHRcdHRoaXMuX21pbkNvbHMgPSAhaXNOYU4oY29uZmlnLm1pbkNvbHMpICYmIGlzRmluaXRlKGNvbmZpZy5taW5Db2xzKSA/IGNvbmZpZy5taW5Db2xzIDogMDtcclxuXHRcdHRoaXMuX21heFJvd3MgPSAhaXNOYU4oY29uZmlnLm1heFJvd3MpICYmIGlzRmluaXRlKGNvbmZpZy5tYXhSb3dzKSA/IGNvbmZpZy5tYXhSb3dzIDogMDtcclxuXHRcdHRoaXMuX21pblJvd3MgPSAhaXNOYU4oY29uZmlnLm1pblJvd3MpICYmIGlzRmluaXRlKGNvbmZpZy5taW5Sb3dzKSA/IGNvbmZpZy5taW5Sb3dzIDogMDtcclxuXHJcblx0XHR0aGlzLm1pbldpZHRoID0gIWlzTmFOKGNvbmZpZy5taW5XaWR0aCkgJiYgaXNGaW5pdGUoY29uZmlnLm1pbldpZHRoKSA/IGNvbmZpZy5taW5XaWR0aCA6IDA7XHJcblx0XHR0aGlzLm1pbkhlaWdodCA9ICFpc05hTihjb25maWcubWluSGVpZ2h0KSAmJiBpc0Zpbml0ZShjb25maWcubWluSGVpZ2h0KSA/IGNvbmZpZy5taW5IZWlnaHQgOiAwO1xyXG5cclxuXHRcdGlmICh0aGlzLl9taW5Db2xzID4gMCAmJiB0aGlzLl9tYXhDb2xzID4gMCAmJiB0aGlzLl9taW5Db2xzID4gdGhpcy5fbWF4Q29scykgdGhpcy5fbWluQ29scyA9IDA7XHJcblx0XHRpZiAodGhpcy5fbWluUm93cyA+IDAgJiYgdGhpcy5fbWF4Um93cyA+IDAgJiYgdGhpcy5fbWluUm93cyA+IHRoaXMuX21heFJvd3MpIHRoaXMuX21pblJvd3MgPSAwO1xyXG5cclxuXHRcdGlmICh0aGlzLl9hZGRlZCkge1xyXG5cdFx0XHR0aGlzLl9uZ0dyaWQudXBkYXRlSXRlbSh0aGlzKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9zaXplID0gdGhpcy5maXhSZXNpemUodGhpcy5fc2l6ZSk7XHJcblxyXG5cdFx0dGhpcy5fcmVjYWxjdWxhdGVQb3NpdGlvbigpO1xyXG5cdFx0dGhpcy5fcmVjYWxjdWxhdGVEaW1lbnNpb25zKCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgbmdEb0NoZWNrKCk6IGJvb2xlYW4ge1xyXG5cdFx0aWYgKHRoaXMuX2RpZmZlciAhPSBudWxsKSB7XHJcblx0XHRcdGNvbnN0IGNoYW5nZXM6IGFueSA9IHRoaXMuX2RpZmZlci5kaWZmKHRoaXMuX2NvbmZpZyk7XHJcblxyXG5cdFx0XHRpZiAoY2hhbmdlcyAhPSBudWxsKSB7XHJcblx0XHRcdFx0dGhpcy5fYXBwbHlDaGFuZ2VzKGNoYW5nZXMpO1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRTaXplKG5ld1NpemU6IE5nR3JpZEl0ZW1TaXplLCB1cGRhdGU6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XHJcblx0XHRuZXdTaXplID0gdGhpcy5maXhSZXNpemUobmV3U2l6ZSk7XHJcblx0XHR0aGlzLl9zaXplID0gbmV3U2l6ZTtcclxuXHRcdGlmICh1cGRhdGUpIHRoaXMuX3JlY2FsY3VsYXRlRGltZW5zaW9ucygpO1xyXG5cclxuXHRcdHRoaXMub25JdGVtQ2hhbmdlLmVtaXQodGhpcy5nZXRFdmVudE91dHB1dCgpKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRHcmlkUG9zaXRpb24oZ3JpZFBvc2l0aW9uOiBOZ0dyaWRJdGVtUG9zaXRpb24sIHVwZGF0ZTogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcclxuXHRcdHRoaXMuX2N1cnJlbnRQb3NpdGlvbiA9IGdyaWRQb3NpdGlvbjtcclxuXHRcdGlmICh1cGRhdGUpIHRoaXMuX3JlY2FsY3VsYXRlUG9zaXRpb24oKTtcclxuXHJcblx0XHR0aGlzLm9uSXRlbUNoYW5nZS5lbWl0KHRoaXMuZ2V0RXZlbnRPdXRwdXQoKSk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2F2ZVBvc2l0aW9uKG5ld1Bvc2l0aW9uOiBOZ0dyaWRJdGVtUG9zaXRpb24pOiB2b2lkIHtcclxuXHRcdHRoaXMuX3Bvc2l0aW9uID0gbmV3UG9zaXRpb247XHJcblx0XHR0aGlzLl9jdXJyZW50UG9zaXRpb24gPSBuZXdQb3NpdGlvbjtcclxuXHJcblx0XHR0aGlzLl9yZWNhbGN1bGF0ZVBvc2l0aW9uKCk7XHJcblxyXG5cdFx0dGhpcy5vbkl0ZW1DaGFuZ2UuZW1pdCh0aGlzLmdldEV2ZW50T3V0cHV0KCkpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldEV2ZW50T3V0cHV0KCk6IE5nR3JpZEl0ZW1FdmVudCB7XHJcblx0XHRyZXR1cm4gPE5nR3JpZEl0ZW1FdmVudD57XHJcblx0XHRcdHBheWxvYWQ6IHRoaXMuX3BheWxvYWQsXHJcblx0XHRcdGNvbDogdGhpcy5fY3VycmVudFBvc2l0aW9uLmNvbCxcclxuXHRcdFx0cm93OiB0aGlzLl9jdXJyZW50UG9zaXRpb24ucm93LFxyXG5cdFx0XHRzaXpleDogdGhpcy5fc2l6ZS54LFxyXG5cdFx0XHRzaXpleTogdGhpcy5fc2l6ZS55LFxyXG5cdFx0XHR3aWR0aDogdGhpcy5fZWxlbVdpZHRoLFxyXG5cdFx0XHRoZWlnaHQ6IHRoaXMuX2VsZW1IZWlnaHQsXHJcblx0XHRcdGxlZnQ6IHRoaXMuX2VsZW1MZWZ0LFxyXG5cdFx0XHR0b3A6IHRoaXMuX2VsZW1Ub3BcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0UG9zaXRpb24oeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcclxuXHRcdHN3aXRjaCAodGhpcy5fY2FzY2FkZU1vZGUpIHtcclxuXHRcdFx0Y2FzZSAndXAnOlxyXG5cdFx0XHRjYXNlICdsZWZ0JzpcclxuXHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHR0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgeCArICdweCwgJyArIHkgKyAncHgpJyk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3JpZ2h0JzpcclxuXHRcdFx0XHR0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgLXggKyAncHgsICcgKyB5ICsgJ3B4KScpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdkb3duJzpcclxuXHRcdFx0XHR0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgeCArICdweCwgJyArIC15ICsgJ3B4KScpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX2VsZW1MZWZ0ID0geDtcclxuXHRcdHRoaXMuX2VsZW1Ub3AgPSB5O1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldENhc2NhZGVNb2RlKGNhc2NhZGU6IHN0cmluZyk6IHZvaWQge1xyXG5cdFx0dGhpcy5fY2FzY2FkZU1vZGUgPSBjYXNjYWRlO1xyXG5cdFx0c3dpdGNoIChjYXNjYWRlKSB7XHJcblx0XHRcdGNhc2UgJ3VwJzpcclxuXHRcdFx0Y2FzZSAnbGVmdCc6XHJcblx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0dGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCwgJ2xlZnQnLCAnMHB4Jyk7XHJcblx0XHRcdFx0dGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCwgJ3RvcCcsICcwcHgnKTtcclxuXHRcdFx0XHR0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAncmlnaHQnLCBudWxsKTtcclxuXHRcdFx0XHR0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAnYm90dG9tJywgbnVsbCk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3JpZ2h0JzpcclxuXHRcdFx0XHR0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAncmlnaHQnLCAnMHB4Jyk7XHJcblx0XHRcdFx0dGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCwgJ3RvcCcsICcwcHgnKTtcclxuXHRcdFx0XHR0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAnbGVmdCcsIG51bGwpO1xyXG5cdFx0XHRcdHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICdib3R0b20nLCBudWxsKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnZG93bic6XHJcblx0XHRcdFx0dGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCwgJ2xlZnQnLCAnMHB4Jyk7XHJcblx0XHRcdFx0dGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCwgJ2JvdHRvbScsICcwcHgnKTtcclxuXHRcdFx0XHR0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAncmlnaHQnLCBudWxsKTtcclxuXHRcdFx0XHR0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAndG9wJywgbnVsbCk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0RGltZW5zaW9ucyh3OiBudW1iZXIsIGg6IG51bWJlcik6IHZvaWQge1xyXG5cdFx0aWYgKHcgPCB0aGlzLm1pbldpZHRoKSB3ID0gdGhpcy5taW5XaWR0aDtcclxuXHRcdGlmIChoIDwgdGhpcy5taW5IZWlnaHQpIGggPSB0aGlzLm1pbkhlaWdodDtcclxuXHJcblx0XHR0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAnd2lkdGgnLCB3ICsgJ3B4Jyk7XHJcblx0XHR0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAnaGVpZ2h0JywgaCArICdweCcpO1xyXG5cclxuXHRcdHRoaXMuX2VsZW1XaWR0aCA9IHc7XHJcblx0XHR0aGlzLl9lbGVtSGVpZ2h0ID0gaDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGFydE1vdmluZygpOiB2b2lkIHtcclxuXHRcdHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICdtb3ZpbmcnLCB0cnVlKTtcclxuXHRcdGNvbnN0IHN0eWxlOiBhbnkgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQpO1xyXG5cdFx0aWYgKHRoaXMuX25nR3JpZC5hdXRvU3R5bGUpIHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICd6LWluZGV4JywgKHBhcnNlSW50KHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ3otaW5kZXgnKSkgKyAxKS50b1N0cmluZygpKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdG9wTW92aW5nKCk6IHZvaWQge1xyXG5cdFx0dGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCwgJ21vdmluZycsIGZhbHNlKTtcclxuXHRcdGNvbnN0IHN0eWxlOiBhbnkgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQpO1xyXG5cdFx0aWYgKHRoaXMuX25nR3JpZC5hdXRvU3R5bGUpIHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICd6LWluZGV4JywgKHBhcnNlSW50KHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ3otaW5kZXgnKSkgLSAxKS50b1N0cmluZygpKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyByZWNhbGN1bGF0ZVNlbGYoKTogdm9pZCB7XHJcblx0XHR0aGlzLl9yZWNhbGN1bGF0ZVBvc2l0aW9uKCk7XHJcblx0XHR0aGlzLl9yZWNhbGN1bGF0ZURpbWVuc2lvbnMoKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBmaXhSZXNpemUobmV3U2l6ZTogTmdHcmlkSXRlbVNpemUpOiBOZ0dyaWRJdGVtU2l6ZSB7XHJcblx0XHRpZiAodGhpcy5fbWF4Q29scyA+IDAgJiYgbmV3U2l6ZS54ID4gdGhpcy5fbWF4Q29scykgbmV3U2l6ZS54ID0gdGhpcy5fbWF4Q29scztcclxuXHRcdGlmICh0aGlzLl9tYXhSb3dzID4gMCAmJiBuZXdTaXplLnkgPiB0aGlzLl9tYXhSb3dzKSBuZXdTaXplLnkgPSB0aGlzLl9tYXhSb3dzO1xyXG5cclxuXHRcdGlmICh0aGlzLl9taW5Db2xzID4gMCAmJiBuZXdTaXplLnggPCB0aGlzLl9taW5Db2xzKSBuZXdTaXplLnggPSB0aGlzLl9taW5Db2xzO1xyXG5cdFx0aWYgKHRoaXMuX21pblJvd3MgPiAwICYmIG5ld1NpemUueSA8IHRoaXMuX21pblJvd3MpIG5ld1NpemUueSA9IHRoaXMuX21pblJvd3M7XHJcblxyXG5cdFx0Y29uc3QgaXRlbVdpZHRoID0gKG5ld1NpemUueCAqIHRoaXMuX25nR3JpZC5jb2xXaWR0aCkgKyAoKHRoaXMuX25nR3JpZC5tYXJnaW5MZWZ0ICsgdGhpcy5fbmdHcmlkLm1hcmdpblJpZ2h0KSAqIChuZXdTaXplLnggLSAxKSk7XHJcblx0XHRpZiAoaXRlbVdpZHRoIDwgdGhpcy5taW5XaWR0aCkgbmV3U2l6ZS54ID0gTWF0aC5jZWlsKCh0aGlzLm1pbldpZHRoICsgdGhpcy5fbmdHcmlkLm1hcmdpblJpZ2h0ICsgdGhpcy5fbmdHcmlkLm1hcmdpbkxlZnQpIC8gKHRoaXMuX25nR3JpZC5jb2xXaWR0aCArIHRoaXMuX25nR3JpZC5tYXJnaW5SaWdodCArIHRoaXMuX25nR3JpZC5tYXJnaW5MZWZ0KSk7XHJcblxyXG5cdFx0Y29uc3QgaXRlbUhlaWdodCA9IChuZXdTaXplLnkgKiB0aGlzLl9uZ0dyaWQucm93SGVpZ2h0KSArICgodGhpcy5fbmdHcmlkLm1hcmdpblRvcCArIHRoaXMuX25nR3JpZC5tYXJnaW5Cb3R0b20pICogKG5ld1NpemUueSAtIDEpKTtcclxuXHRcdGlmIChpdGVtSGVpZ2h0IDwgdGhpcy5taW5IZWlnaHQpIG5ld1NpemUueSA9IE1hdGguY2VpbCgodGhpcy5taW5IZWlnaHQgKyB0aGlzLl9uZ0dyaWQubWFyZ2luQm90dG9tICsgdGhpcy5fbmdHcmlkLm1hcmdpblRvcCkgLyAodGhpcy5fbmdHcmlkLnJvd0hlaWdodCArIHRoaXMuX25nR3JpZC5tYXJnaW5Cb3R0b20gKyB0aGlzLl9uZ0dyaWQubWFyZ2luVG9wKSk7XHJcblxyXG5cdFx0cmV0dXJuIG5ld1NpemU7XHJcblx0fVxyXG5cclxuXHQvL1x0UHJpdmF0ZSBtZXRob2RzXHJcblx0cHJpdmF0ZSBlbGVtZW50TWF0Y2hlcyhlbGVtZW50OiBhbnksIHNlbGVjdG9yOiBzdHJpbmcpOiBib29sZWFuIHtcclxuXHRcdGlmIChlbGVtZW50Lm1hdGNoZXMpIHJldHVybiBlbGVtZW50Lm1hdGNoZXMoc2VsZWN0b3IpO1xyXG5cdFx0aWYgKGVsZW1lbnQub01hdGNoZXNTZWxlY3RvcikgcmV0dXJuIGVsZW1lbnQub01hdGNoZXNTZWxlY3RvcihzZWxlY3Rvcik7XHJcblx0XHRpZiAoZWxlbWVudC5tc01hdGNoZXNTZWxlY3RvcikgcmV0dXJuIGVsZW1lbnQubXNNYXRjaGVzU2VsZWN0b3Ioc2VsZWN0b3IpO1xyXG5cdFx0aWYgKGVsZW1lbnQubW96TWF0Y2hlc1NlbGVjdG9yKSByZXR1cm4gZWxlbWVudC5tb3pNYXRjaGVzU2VsZWN0b3Ioc2VsZWN0b3IpO1xyXG5cdFx0aWYgKGVsZW1lbnQud2Via2l0TWF0Y2hlc1NlbGVjdG9yKSByZXR1cm4gZWxlbWVudC53ZWJraXRNYXRjaGVzU2VsZWN0b3Ioc2VsZWN0b3IpO1xyXG5cclxuXHRcdGNvbnN0IG1hdGNoZXM6IGFueSA9IChlbGVtZW50LmRvY3VtZW50IHx8IGVsZW1lbnQub3duZXJEb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XHJcblx0XHRsZXQgaTogbnVtYmVyID0gbWF0Y2hlcy5sZW5ndGg7XHJcblx0XHR3aGlsZSAoLS1pID49IDAgJiYgbWF0Y2hlcy5pdGVtKGkpICE9PSBlbGVtZW50KSB7IH1cclxuXHRcdHJldHVybiBpID4gLTE7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9yZWNhbGN1bGF0ZVBvc2l0aW9uKCk6IHZvaWQge1xyXG5cdFx0Y29uc3QgeDogbnVtYmVyID0gKHRoaXMuX25nR3JpZC5jb2xXaWR0aCArIHRoaXMuX25nR3JpZC5tYXJnaW5MZWZ0ICsgdGhpcy5fbmdHcmlkLm1hcmdpblJpZ2h0KSAqICh0aGlzLl9jdXJyZW50UG9zaXRpb24uY29sIC0gMSkgKyB0aGlzLl9uZ0dyaWQubWFyZ2luTGVmdDtcclxuXHRcdGNvbnN0IHk6IG51bWJlciA9ICh0aGlzLl9uZ0dyaWQucm93SGVpZ2h0ICsgdGhpcy5fbmdHcmlkLm1hcmdpblRvcCArIHRoaXMuX25nR3JpZC5tYXJnaW5Cb3R0b20pICogKHRoaXMuX2N1cnJlbnRQb3NpdGlvbi5yb3cgLSAxKSArIHRoaXMuX25nR3JpZC5tYXJnaW5Ub3A7XHJcblxyXG5cdFx0dGhpcy5zZXRQb3NpdGlvbih4LCB5KTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX3JlY2FsY3VsYXRlRGltZW5zaW9ucygpOiB2b2lkIHtcclxuXHRcdGlmICh0aGlzLl9zaXplLnggPCB0aGlzLl9uZ0dyaWQubWluQ29scykgdGhpcy5fc2l6ZS54ID0gdGhpcy5fbmdHcmlkLm1pbkNvbHM7XHJcblx0XHRpZiAodGhpcy5fc2l6ZS55IDwgdGhpcy5fbmdHcmlkLm1pblJvd3MpIHRoaXMuX3NpemUueSA9IHRoaXMuX25nR3JpZC5taW5Sb3dzO1xyXG5cclxuXHRcdGNvbnN0IG5ld1dpZHRoOiBudW1iZXIgPSAodGhpcy5fbmdHcmlkLmNvbFdpZHRoICogdGhpcy5fc2l6ZS54KSArICgodGhpcy5fbmdHcmlkLm1hcmdpbkxlZnQgKyB0aGlzLl9uZ0dyaWQubWFyZ2luUmlnaHQpICogKHRoaXMuX3NpemUueCAtIDEpKTtcclxuXHRcdGNvbnN0IG5ld0hlaWdodDogbnVtYmVyID0gKHRoaXMuX25nR3JpZC5yb3dIZWlnaHQgKiB0aGlzLl9zaXplLnkpICsgKCh0aGlzLl9uZ0dyaWQubWFyZ2luVG9wICsgdGhpcy5fbmdHcmlkLm1hcmdpbkJvdHRvbSkgKiAodGhpcy5fc2l6ZS55IC0gMSkpO1xyXG5cclxuXHRcdGNvbnN0IHc6IG51bWJlciA9IE1hdGgubWF4KHRoaXMubWluV2lkdGgsIHRoaXMuX25nR3JpZC5taW5XaWR0aCwgbmV3V2lkdGgpO1xyXG5cdFx0Y29uc3QgaDogbnVtYmVyID0gTWF0aC5tYXgodGhpcy5taW5IZWlnaHQsIHRoaXMuX25nR3JpZC5taW5IZWlnaHQsIG5ld0hlaWdodCk7XHJcblxyXG5cdFx0dGhpcy5zZXREaW1lbnNpb25zKHcsIGgpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfZ2V0TW91c2VQb3NpdGlvbihlOiBhbnkpOiBOZ0dyaWRSYXdQb3NpdGlvbiB7XHJcblx0XHRpZiAoZS5vcmlnaW5hbEV2ZW50ICYmIGUub3JpZ2luYWxFdmVudC50b3VjaGVzKSB7XHJcblx0XHRcdGNvbnN0IG9lOiBhbnkgPSBlLm9yaWdpbmFsRXZlbnQ7XHJcblx0XHRcdGUgPSBvZS50b3VjaGVzLmxlbmd0aCA/IG9lLnRvdWNoZXNbMF0gOiBvZS5jaGFuZ2VkVG91Y2hlc1swXTtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCByZWZQb3M6IE5nR3JpZFJhd1Bvc2l0aW9uID0gdGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGxlZnQ6IGUuY2xpZW50WCAtIHJlZlBvcy5sZWZ0LFxyXG5cdFx0XHR0b3A6IGUuY2xpZW50WSAtIHJlZlBvcy50b3BcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9hcHBseUNoYW5nZXMoY2hhbmdlczogYW55KTogdm9pZCB7XHJcblx0XHRjaGFuZ2VzLmZvckVhY2hBZGRlZEl0ZW0oKHJlY29yZDogYW55KSA9PiB7IHRoaXMuX2NvbmZpZ1tyZWNvcmQua2V5XSA9IHJlY29yZC5jdXJyZW50VmFsdWU7IH0pO1xyXG5cdFx0Y2hhbmdlcy5mb3JFYWNoQ2hhbmdlZEl0ZW0oKHJlY29yZDogYW55KSA9PiB7IHRoaXMuX2NvbmZpZ1tyZWNvcmQua2V5XSA9IHJlY29yZC5jdXJyZW50VmFsdWU7IH0pO1xyXG5cdFx0Y2hhbmdlcy5mb3JFYWNoUmVtb3ZlZEl0ZW0oKHJlY29yZDogYW55KSA9PiB7IGRlbGV0ZSB0aGlzLl9jb25maWdbcmVjb3JkLmtleV07IH0pO1xyXG5cclxuXHRcdHRoaXMuc2V0Q29uZmlnKHRoaXMuX2NvbmZpZyk7XHJcblx0fVxyXG59Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
