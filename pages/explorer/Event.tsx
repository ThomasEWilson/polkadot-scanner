import React from 'react';

import { default as EventDisplay } from '/ui-components/polkadot/Event'
import { default as Expander } from '/ui-components/polkadot/Expander';
import type { EventRecord } from '@polkadot/types/interfaces';

interface Props {
    className?: string;
    value: EventRecord;
  }
  
  function Event ({ className = '', value: { event } }: Props): React.ReactElement<Props> {
    return (
      <Expander
        className={className}
        summary={`${event.section}.${event.method}`}
        summaryMeta={event.meta}
      >
        <EventDisplay
          className='details'
          value={event}
        />
      </Expander>
    );
  }
  
  export default React.memo(Event);
  