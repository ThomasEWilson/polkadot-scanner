import React from 'react';

import { Event as EventDisplay, Expander } from '@polkadot/react-components';
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
        // summaryMeta={event.meta}
      >
        <EventDisplay
          className='details'
          value={event}
        />
      </Expander>
    );
  }
  
  export default React.memo(Event);
  