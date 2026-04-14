import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-institutions-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page">
      <section class="panel hero-block">
        <p class="eyebrow">Institution Directory</p>
        <h1>Mannaniyya Institutions</h1>
        <p class="muted">Educational institutions and Thahfeelul Qur'an colleges presented as a standalone page.</p>
      </section>

      <section class="grid-two">
        <article class="panel institution-card">
          <h2>Mannaniyya Educational Institutions</h2>
          <ol class="institution-list">
            <li>Jamia Mannaniyya Islamic University, Varkala, TVPM</li>
            <li>Mannaniyya Umarul Farooq Academy, Kilikolloor, Kollam</li>
            <li>Mannaniyya Shareeath College, Pangod, TVPM</li>
            <li>Mannaniyya Islamic Academy, Poredom, Kollam</li>
            <li>Mannaniyya Banath Yatheemkhana Kadakkal, Mukkunnam, Kollam</li>
            <li>Mannaniyya Hidaya Campus, Vilakkudi, Kunnicode, Kollam</li>
            <li>Mannaniyya Arts and Science College, Pangod TVPM</li>
          </ol>
        </article>

        <article class="panel institution-card highlighted">
          <h2>Mannaniyya Thahfeelul Qur'an Colleges</h2>
          <ol class="institution-list">
            <li>Mukkunnam, Kadakkal</li>
            <li>Madanthappacha, Kallambalam</li>
            <li>Kilikolloor, Kollam</li>
            <li>Velichikkala, Kollam</li>
            <li>Poredom, Kollam</li>
          </ol>
        </article>
      </section>
    </section>
  `,
  styles: [
    `
      .hero-block,
      .institution-card {
        padding: 1.5rem;
      }
      .eyebrow {
        margin: 0 0 0.8rem;
        color: var(--primary);
        font-size: 0.8rem;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        font-weight: 800;
      }
      h1,
      h2 {
        margin: 0;
      }
      .hero-block {
        display: grid;
        gap: 0.8rem;
      }
      .institution-card {
        display: grid;
        gap: 0.9rem;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(223, 248, 227, 0.74));
      }
      .institution-card.highlighted {
        background: linear-gradient(180deg, rgba(14, 122, 67, 0.96), rgba(7, 83, 45, 0.92));
        color: white;
      }
      .institution-list {
        margin: 0;
        padding-left: 1.2rem;
        display: grid;
        gap: 0.7rem;
      }
    `,
  ],
})
export class InstitutionsPageComponent {}
