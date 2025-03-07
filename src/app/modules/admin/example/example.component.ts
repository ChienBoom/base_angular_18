import { Component, ViewEncapsulation } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { AraAutocompleteComponent } from '@aratech/controls/ara-autocomplete/ara-autocomplete.component';
import { AraInputTextComponent } from '@aratech/controls/ara-input-text/ara-input-text.component';
import { ConfigService } from '@aratech/services/config.service';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
    selector: 'example',
    standalone: true,
    templateUrl: './example.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [
        AraAutocompleteComponent,
        ReactiveFormsModule,
        MatButtonModule,
        TranslocoModule,
        AraInputTextComponent,
    ],
})
export class ExampleComponent {
    options: any[] = [
        {
            id: 'option 1',
            name: 'option 1'
        },
        {
            id: 'option 2',
            name: 'option 2'
        },
        {
            id: 'option 3',
            name: 'option 3'
        },
    ];
    myForm: FormGroup;
    value: string = 'option 1';

    constructor(private fb: FormBuilder, private configService: ConfigService) {
        this.myForm = this.fb.group({
            search2: ['option 1', Validators.required],
        });
        console.log("config: ", this.configService.getConfig())
    }

    getErrorMessage(controlName: string): string | null {
        const control = this.myForm.get(controlName) as FormControl;
        if (control?.hasError('required')) {
            return 'control is required';
        }
        if (control?.hasError('email')) {
            return 'Invalid control format';
        }
        if (control?.hasError('minlength')) {
            return 'control must be at least 6 characters long';
        }

        if (control?.hasError('maxlength')) {
            return 'control must be at least 6 characters long';
        }
        if (control?.hasError('min')) {
            return 'control is required';
        }
        if (control?.hasError('max')) {
            return 'Invalid control format';
        }
        return null;
    }

    handleChangeValue(event: any) {
        console.log(event);
        this.value = event;
    }

    handleClearValue() {
        console.log('Clear');
    }

    handleInputChange(event: any) {
        console.log(event);
    }

    onSubmit() {
        console.log('value: ', this.value);
        console.log('Vlues: ', this.myForm.value);
    }
}
