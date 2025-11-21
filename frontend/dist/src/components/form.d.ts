export declare class Form {
    readonly agreeElement: HTMLInputElement | null;
    readonly processElement: HTMLElement | null;
    readonly page: "signup" | "login";
    private fields;
    constructor(page: "signup" | "login");
    private validateField;
    private validateForm;
    private processForm;
    private showFormError;
}
//# sourceMappingURL=form.d.ts.map