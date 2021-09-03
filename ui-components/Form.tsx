import type { FormInstance } from 'antd/lib/form/hooks/useForm';
import type { FieldData, Rule } from 'rc-field-form/lib/interface';

import { Form } from 'antd';

const FormItem = Form.Item;

export type { FieldData, FormInstance, Rule };
export { Form, FormItem };
