import type { Meta, StoryObj } from '@storybook/nextjs-vite';

function TokenSwatch({ name, value }: { name: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
      <div style={{
        width: '40px',
        height: '40px',
        background: value,
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-sm)',
        flexShrink: 0,
      }} />
      <div>
        <code style={{ fontSize: 'var(--primitive-text-xs)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}>
          {name}
        </code>
        <div style={{ fontSize: 'var(--primitive-text-xs)', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>
          {value}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '32px' }}>
      <h2 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'var(--primitive-text-xs)',
        letterSpacing: 'var(--letter-spacing-heading)',
        textTransform: 'var(--text-transform-heading)' as React.CSSProperties['textTransform'],
        color: 'var(--color-accent)',
        marginBottom: '16px',
        borderBottom: '1px solid var(--color-border)',
        paddingBottom: '8px',
      }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function ThemeTokensDoc() {
  return (
    <div style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)', maxWidth: '480px' }}>
      <Section title="Surfaces">
        <TokenSwatch name="--color-surface" value="var(--color-surface)" />
        <TokenSwatch name="--color-surface-elevated" value="var(--color-surface-elevated)" />
      </Section>
      <Section title="Text">
        <TokenSwatch name="--color-text-primary" value="var(--color-text-primary)" />
        <TokenSwatch name="--color-text-secondary" value="var(--color-text-secondary)" />
      </Section>
      <Section title="Accent">
        <TokenSwatch name="--color-accent" value="var(--color-accent)" />
        <TokenSwatch name="--color-accent-hover" value="var(--color-accent-hover)" />
      </Section>
      <Section title="Border">
        <TokenSwatch name="--color-border" value="var(--color-border)" />
      </Section>
      <Section title="Typography">
        <div style={{ marginBottom: '8px' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--primitive-text-sm)', color: 'var(--color-text-primary)' }}>
            Heading font (--font-heading)
          </span>
        </div>
        <div>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--primitive-text-sm)', color: 'var(--color-text-primary)' }}>
            Body font (--font-body)
          </span>
        </div>
      </Section>
    </div>
  );
}

const meta: Meta = {
  title: 'Design System/Theme Tokens',
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj;

export const AllTokens: Story = {
  render: () => <ThemeTokensDoc />,
};
