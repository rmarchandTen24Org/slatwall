/// <reference path='../../../../typings/slatwallTypescript.d.ts' />
/// <reference path='../../../../typings/tsd.d.ts' />
/** provides an anchor for a parent directive n elements from child */
class SWAnchor implements ng.IDirective {
	public link:ng.IDirectiveLinkFn = (scope:any) =>
    {
       scope.$emit('anchor', {anchorType: "form", scope: scope});
    }
	public static Factory():ng.IDirectiveFactory{
        var directive:ng.IDirectiveFactory = () => new SWAnchor();
        return directive;
    }
	// @ngInject
	constructor(){}
}

export {
	SWAnchor
}


	
