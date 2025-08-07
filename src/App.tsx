import { ChangeEventHandler, useCallback, useState } from "react"
import axios from 'axios';

function App() {
  const [form, setForm] = useState({
    step: 1,
    accountType: '',
    name: '',
    documentNumber: '',
    role: '',
    email: '',
    password: '',
    confirmPassword: '',
    error: '',
    success: '',
  });

  console.log('form', form)

  function calculateProgress() {
    let progress = 0;
    if (form.accountType) progress += 30;
    if (form.name) progress += 15;
    if (form.documentNumber) progress += 15;
    if (form.role) progress += 15;
    if (form.email) progress += 10;
    if (form.password) progress += 10;
    if (form.confirmPassword) progress += 5;
    return progress;
  }

  const updateForm: ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    const { name, value } = event.target
    setForm(previous => {
      return {
        ...previous,
        [name]: value
      };
    })
  }, []);

  const validate = useCallback(() => {
    if (form.step === 1 && !form.accountType) {
      setForm(previous => {
        return {
          ...previous,
          error: 'Selecione o tipo de conta',
        };
      });
      return false;
    }

    if (form.step === 2) {
      if (!form.name) {
        setForm(previous => {
          return {
            ...previous,
            error: 'Preencha o seu nome',
          };
        });
        return false;
      }
      if (!form.documentNumber) {
        setForm(previous => {
          return {
            ...previous,
            error: 'Preencha o seu CPF',
          };
        });
        return false;
      }
      if (!form.role) {
        setForm(previous => {
          return {
            ...previous,
            error: 'Preencha o seu cargo',
          };
        });
        return false;
      }
    }

    if (form.step === 3) {
      if (!form.email) {
        setForm(previous => {
          return {
            ...previous,
            error: 'Preencha o seu e-mail',
          };
        });
        return false;
      }
      if (!form.password) {
        setForm(previous => {
          return {
            ...previous,
            error: 'Preencha a sua senha',
          };
        });
        return false;
      }
      if (!form.confirmPassword) {
        setForm(previous => {
          return {
            ...previous,
            error: 'Preencha a sua confirmação de senha',
          };
        });
        return false;
      }
      if (form.password !== form.confirmPassword) {
        setForm(previous => {
          return {
            ...previous,
            error: 'As senhas não conferem',
          };
        });
        return false;
      }
    }

    setForm(previous => {
      return {
        ...previous,
        error: '',
      };
    });

    return true;
  }, [form]);

  const next = useCallback(() => {
    if (!validate()) return;

    setForm(previous => {
      return {
        ...previous,
        step: previous.step + 1
      }
    });
  }, [validate]);

  const confirm = useCallback(async () => {
    if (!validate()) return;

    const body = {
      accountType: form.accountType,
      name: form.name,
      role: form.role,
      documentNumber: form.documentNumber,
      email: form.email,
      password: form.password,
    };

    const response = await axios.post('https://jsonplaceholder.typicode.com/users', body);

    const successMessage = "Conta criada com sucesso #" + response.data.id;
    setForm(previous => {
      return {
        ...previous,
        success: successMessage,
      }
    });
  }, [validate, form]);

  const previous = useCallback(() => {
    setForm(previous => {
      return {
        ...previous,
        step: previous.step - 1
      }
    });
  }, []);

  return (
    <div>
      <div>
        <div>
          <span>
            Progresso:{' '}
          </span>
          <span data-testid="span-progress">{calculateProgress()}%</span>
        </div>
        <div>
          <span>Passo:{' '}</span>
          <span data-testid="span-step">{form.step}</span>
        </div>
        {form.error ? (
          <div>
            <span>Erro:{' '}</span>
            <span data-testid="span-error">{form.error}</span>
          </div>
        ) : null}
        {form.success ? (
          <div>
            <span>Sucesso:{' '}</span>
            <span data-testid="span-success">{form.success}</span>
          </div>
        ) : null}
      </div>

      {/* Step 1 */}
      {form.step === 1 ? (
        <div>
          <input type="radio" id="administrator" name="accountType" value="administrator" onChange={updateForm} checked={form.accountType === 'administrator'} />
          <label htmlFor="administrator">Administrador</label>
          <br />
          <input type="radio" id="editor" name="accountType" value="editor" onChange={updateForm} checked={form.accountType === 'editor'} />
          <label htmlFor="editor">Editor</label>
          <br />
          <input type="radio" id="operator" name="accountType" value="operator" onChange={updateForm} checked={form.accountType === 'operator'} />
          <label htmlFor="operator">Operador</label>
        </div>
      ) : null}

      {/* Step 2 */}
      {form.step === 2 ? (
        <div>
          <label htmlFor="name">Nome:</label>
          <input type="text" id="name" name="name" placeholder="Informe seu nome" onChange={updateForm} value={form.name} />
          <br />
          <label htmlFor="documentNumber">CPF:</label>
          <input type="text" id="documentNumber" name="documentNumber" placeholder="Informe seu CPF" onChange={updateForm} value={form.documentNumber} />
          <br />
          <label htmlFor="role">Cargo:</label>
          <input type="text" id="role" name="role" placeholder="Informe seu cargo" onChange={updateForm} value={form.role} />
        </div>
      ) : null}

      {/* Step 3 */}
      {form.step === 3 ? (
        <div>
          <label htmlFor="email">E-mail</label>
          <input type="text" id="email" name="email" placeholder="Informe seu e-mail" onChange={updateForm} value={form.email} />
          <br />
          <label htmlFor="password">Senha:</label>
          <input type="password" id="password" name="password" placeholder="Informe sua senha" onChange={updateForm} value={form.password} />
          <br />
          <label htmlFor="confirmPassword">Confirmação de senha:</label>
          <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Repita sua senha" onChange={updateForm} value={form.confirmPassword} />
        </div>
      ) : null}

      <div>
        {form.step > 1 ? (
          <button data-testid="button-previous" onClick={previous}>Voltar</button>
        ) : null}
        {form.step < 3 ? (
          <button data-testid="button-next" onClick={next}>Próximo</button>
        ) : (
          <button data-testid="button-confirm" onClick={confirm}>Confirmar</button>
        )}
      </div>
    </div>
  )
}

export default App
