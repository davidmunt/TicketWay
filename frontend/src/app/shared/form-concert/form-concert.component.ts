import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConcertService } from '../../core/services/concert.service';
import { ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-concert-form',
  templateUrl: './form-concert.component.html',
  styleUrls: ['./form-concert.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class ConcertFormComponent implements OnInit {
  update: boolean = false;
  submitted = false;
  loading = false;
  errorMessage = false;
  form: FormGroup = new FormGroup({
    name: new FormControl(''),
    date: new FormControl(''),
    direction: new FormControl(''),
    protagonist: new FormControl(''),
    description: new FormControl(''),
  });

  constructor(
    private route: ActivatedRoute,
    private concertService: ConcertService,
    private router: Router,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      direction: ['', Validators.required],
      protagonist: ['', Validators.required],
      description: ['', Validators.required],
    });

    const slug = this.route.snapshot.params['slug'];
    if (slug) {
      this.update = true;
      this.get_concert(slug);
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.valid) {
      if (this.update) {
        console.log('LLega aqqquiiii');
        this.update_concert();
      } else {
        console.log('LLega aqqquiiii');
        this.insert_concert();
      }
    } else {
      return;
    }
  }

  get_concert(slug: string): void {
    this.concertService.get_concert(slug).subscribe({
      next: (data) => {
        this.form.patchValue({
          name: data.name,
          date: data.date,
          direction: data.direction,
          protagonist: data.protagonist,
          description: data.description,
        });
      },
      error: (e) => console.error(e),
    });
  }

  insert_concert(): void {
    // console.log(`Created`);
    this.concertService.create_concert(this.form.value).subscribe({
      next: (data) => {
        this.router.navigate(['/home']);
        this.toastrService.success('Concert added successfully');
      },
      error: (e) => console.error(e),
    });
  }

  update_concert(): void {
    // console.log(`Update: ${this.route.snapshot.params['slug']}`);
    this.concertService
      .update_concert(this.route.snapshot.params['slug'], this.form.value)
      .subscribe({
        next: (data) => {
          this.router.navigate(['/home']);
          this.toastrService.success('Concert updated successfully');
        },
        error: (e) => console.error(e),
      });
  }
}
