import { beforeEach, describe, expect, test } from 'vitest';
import { render, fireEvent, RenderResult } from '@testing-library/react';

import App from './App';
import { RegistryProvider } from './registry/RegistryProvider';
import { MockAccountGateway } from './gateway/AccountGateway';

let result: RenderResult;
beforeEach(() => {
  const registry: Record<string, any> = {
    accountGateway: new MockAccountGateway()
  }

  result = render(
    <RegistryProvider value={registry}>
      <App />
    </RegistryProvider>
  )
});

describe('App', () => {
  test('Deve testar o fluxo de progresso no preenchimento do fomulário', () => {
    // Step 1
    expect(result.getByTestId('span-progress').textContent).toBe('0%');
    expect(result.getByTestId('span-step').textContent).toBe('1');
    fireEvent.click(result.getByDisplayValue('administrator'));
    expect(result.getByTestId('span-progress').textContent).toBe('30%');
    fireEvent.click(result.getByTestId('button-next'));

    // Step 2
    expect(result.getByTestId('span-step').textContent).toBe('2');
    fireEvent.input(result.getByPlaceholderText('Informe seu nome'), { target: { value: 'Douglas Nassif' } });
    expect(result.getByTestId('span-progress').textContent).toBe('45%');
    fireEvent.input(result.getByPlaceholderText('Informe seu CPF'), { target: { value: '00011122233' } });
    expect(result.getByTestId('span-progress').textContent).toBe('60%');
    fireEvent.input(result.getByPlaceholderText('Informe seu cargo'), { target: { value: 'Programador' } });
    expect(result.getByTestId('span-progress').textContent).toBe('75%');
    fireEvent.click(result.getByTestId('button-next'));

    // Step 3
    expect(result.getByTestId('span-step').textContent).toBe('3');
    fireEvent.input(result.getByPlaceholderText('Informe seu e-mail'), { target: { value: 'douglas@email.com' } });
    expect(result.getByTestId('span-progress').textContent).toBe('85%');
    fireEvent.input(result.getByPlaceholderText('Informe sua senha'), { target: { value: 'senha123' } });
    expect(result.getByTestId('span-progress').textContent).toBe('95%');
    fireEvent.input(result.getByPlaceholderText('Repita sua senha'), { target: { value: 'senha123' } })
    expect(result.getByTestId('span-progress').textContent).toBe('100%');

    // Previous
    fireEvent.click(result.getByTestId('button-previous'));
    expect(result.getByTestId('span-step').textContent).toBe('2');
    fireEvent.click(result.getByTestId('button-previous'));
    expect(result.getByTestId('span-step').textContent).toBe('1');
  });

  test('Deve testar a visibilidade dos componentes do formulário', () => {
    // Step 1
    expect(result.queryByDisplayValue('administrator')).toBeInTheDocument();
    expect(result.queryByDisplayValue('editor')).toBeInTheDocument();
    expect(result.queryByDisplayValue('operator')).toBeInTheDocument();
    expect(result.queryByPlaceholderText('Informe seu nome')).not.toBeInTheDocument();
    expect(result.queryByPlaceholderText('Informe seu CPF')).not.toBeInTheDocument();
    expect(result.queryByPlaceholderText('Informe seu cargo')).not.toBeInTheDocument();
    expect(result.queryByPlaceholderText('Informe seu e-mail')).not.toBeInTheDocument();
    expect(result.queryByPlaceholderText('Informe sua senha')).not.toBeInTheDocument();
    expect(result.queryByPlaceholderText('Repita sua senha')).not.toBeInTheDocument();
    expect(result.queryByTestId('button-previous')).not.toBeInTheDocument();
    expect(result.queryByTestId('button-next')).toBeInTheDocument();
    expect(result.queryByTestId('button-confirm')).not.toBeInTheDocument();
    fireEvent.click(result.getByDisplayValue('administrator'));
    fireEvent.click(result.getByTestId('button-next'));

    // Step 2
    expect(result.queryByDisplayValue('administrator')).not.toBeInTheDocument();
    expect(result.queryByDisplayValue('editor')).not.toBeInTheDocument();
    expect(result.queryByDisplayValue('operator')).not.toBeInTheDocument();
    expect(result.queryByPlaceholderText('Informe seu nome')).toBeInTheDocument();
    expect(result.queryByPlaceholderText('Informe seu CPF')).toBeInTheDocument();
    expect(result.queryByPlaceholderText('Informe seu cargo')).toBeInTheDocument();
    expect(result.queryByPlaceholderText('Informe seu e-mail')).not.toBeInTheDocument();
    expect(result.queryByPlaceholderText('Informe sua senha')).not.toBeInTheDocument();
    expect(result.queryByPlaceholderText('Repita sua senha')).not.toBeInTheDocument();
    expect(result.queryByTestId('button-previous')).toBeInTheDocument();
    expect(result.queryByTestId('button-next')).toBeInTheDocument();
    expect(result.queryByTestId('button-confirm')).not.toBeInTheDocument();
    fireEvent.input(result.getByPlaceholderText('Informe seu nome'), { target: { value: 'Douglas Nassif' } });
    fireEvent.input(result.getByPlaceholderText('Informe seu CPF'), { target: { value: '00011122233' } });
    fireEvent.input(result.getByPlaceholderText('Informe seu cargo'), { target: { value: 'Programador' } });
    fireEvent.click(result.getByTestId('button-next'));

    // Step 3
    expect(result.queryByDisplayValue('administrator')).not.toBeInTheDocument();
    expect(result.queryByDisplayValue('editor')).not.toBeInTheDocument();
    expect(result.queryByDisplayValue('operator')).not.toBeInTheDocument();
    expect(result.queryByPlaceholderText('Informe seu nome')).not.toBeInTheDocument();
    expect(result.queryByPlaceholderText('Informe seu CPF')).not.toBeInTheDocument();
    expect(result.queryByPlaceholderText('Informe seu cargo')).not.toBeInTheDocument();
    expect(result.queryByPlaceholderText('Informe seu e-mail')).toBeInTheDocument();
    expect(result.queryByPlaceholderText('Informe sua senha')).toBeInTheDocument();
    expect(result.queryByPlaceholderText('Repita sua senha')).toBeInTheDocument();
    expect(result.queryByTestId('button-previous')).toBeInTheDocument();
    expect(result.queryByTestId('button-next')).not.toBeInTheDocument();
    expect(result.queryByTestId('button-confirm')).toBeInTheDocument();
  });

  test('Deve testar as validações dos campos e o controle do preenchimento do formulário.', async () => {
    // Step 1
    fireEvent.click(result.getByTestId('button-next'));
    expect(result.getByTestId('span-step').textContent).toBe('1');
    expect(result.getByTestId('span-error').textContent).toBe('Selecione o tipo de conta');
    fireEvent.click(result.getByDisplayValue('administrator'));
    fireEvent.click(result.getByTestId('button-next'));

    // Step 2
    expect(result.getByTestId('span-step').textContent).toBe('2');
    fireEvent.click(result.getByTestId('button-next'));
    expect(result.getByTestId('span-step').textContent).toBe('2');
    expect(result.getByTestId('span-error').textContent).toBe('Preencha o seu nome');
    fireEvent.input(result.getByPlaceholderText('Informe seu nome'), { target: { value: 'Douglas Nassif' } });
    fireEvent.click(result.getByTestId('button-next'));
    expect(result.getByTestId('span-step').textContent).toBe('2');
    expect(result.getByTestId('span-error').textContent).toBe('Preencha o seu CPF');
    fireEvent.input(result.getByPlaceholderText('Informe seu CPF'), { target: { value: '00011122233' } });
    fireEvent.click(result.getByTestId('button-next'));
    expect(result.getByTestId('span-step').textContent).toBe('2');
    expect(result.getByTestId('span-error').textContent).toBe('Preencha o seu cargo');
    fireEvent.input(result.getByPlaceholderText('Informe seu cargo'), { target: { value: 'Programador' } });
    fireEvent.click(result.getByTestId('button-next'));

    // Step 3
    expect(result.getByTestId('span-step').textContent).toBe('3');
    fireEvent.click(result.getByTestId('button-confirm'));
    expect(result.getByTestId('span-error').textContent).toBe('Preencha o seu e-mail');
    fireEvent.input(result.getByPlaceholderText('Informe seu e-mail'), { target: { value: 'douglas@email.com' } });
    fireEvent.click(result.getByTestId('button-confirm'));
    expect(result.getByTestId('span-error').textContent).toBe('Preencha a sua senha');
    fireEvent.input(result.getByPlaceholderText('Informe sua senha'), { target: { value: 'senha123' } });
    fireEvent.click(result.getByTestId('button-confirm'));
    expect(result.getByTestId('span-error').textContent).toBe('Preencha a sua confirmação de senha');
    fireEvent.input(result.getByPlaceholderText('Repita sua senha'), { target: { value: 'senha1234' } });
    fireEvent.click(result.getByTestId('button-confirm'));
    expect(result.getByTestId('span-error').textContent).toBe('As senhas não conferem');
    fireEvent.input(result.getByPlaceholderText('Repita sua senha'), { target: { value: 'senha123' } });
    fireEvent.click(result.getByTestId('button-confirm'));

    // Request
    const successMessage = await result.findByTestId('span-success');
    expect(successMessage.textContent).toBe('Conta criada com sucesso #12');
    expect(successMessage).toBeInTheDocument();
  });
});
