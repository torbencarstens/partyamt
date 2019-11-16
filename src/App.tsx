import { Card, Typography, Icon, Tooltip, Row, Col, Tag, Layout, List, Spin} from 'antd';
import { gql } from 'apollo-boost';
import React, { useState, useEffect } from 'react';
import { Query } from 'react-apollo';
import './App.css';
import 'antd/dist/antd.css';
import Title from 'antd/lib/typography/Title';
import CheckableTag from 'antd/lib/tag/CheckableTag';

const { Text } = Typography;
const { Header, Footer, Content, Sider } = Layout;

const eventsQuery = gql`
{
  events {
    id
    title
    location {
      id
      name
      mapsLink
      website
    }
    price
    icsLink
    tags {
      id
      name
    }
    url
  }
}
`;

const tagsQuery = gql`
{
  tags {
    name
  }
}
`;

interface ILocation {
  name: string,
  mapsLink: string,
  website: string,
}

interface ITag {
  name: string,
}

interface IEvent {
  title: string,
  price: number,
  location: ILocation,
  icsLink: string,
  tags: ITag[],
  url: string
}

const Event: React.FC<{event: IEvent}> = ({ event }) => {
  const isEighteenPlus = event.tags.map((value: ITag) => value.name).includes("Ab 18 Jahren");
  const tags = event.tags.filter((value: ITag) => ![ "Ab 18 Jahren", "Eintritt frei" ].includes(value.name));

  return <Card.Grid hoverable={false}>
    <Row>
      <Col>
        <Tooltip title={event.title}>
          <Title level={4} ellipsis={true}>
            { isEighteenPlus ?
              <img alt="adults only" src="/eplus.svg" height={20} width={20} style={ { 'marginBottom': '2.5px', "marginRight": "5px"} as React.CSSProperties } /> : <b />
            }
            <a href={event.url} style={{'color': '#222'}}>{event.title}</a>
          </Title>
        </Tooltip>
      </Col>
    </Row>
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Tooltip title="Download ICS">
          <a href={event.icsLink}>
            <Icon type="calendar" />
          </a>
        </Tooltip>
      </Col>
      <Col span={12}>
        <span>{ event.price ?  '' + parseFloat('' + Math.round(event.price * 100) / 100).toFixed(2) + '€' : "Free" }</span>
      </Col>
    </Row>
    <Row>
      <Col>
        <a href={event.location.website}>
          <Icon type="compass" style={{ "marginRight": "5px" } as React.CSSProperties} />
        </a>
        <a href={event.location.mapsLink}>
          <Text>
            <Tooltip title={ event.location.name }>{ event.location.name }</Tooltip>
          </Text>
        </a>
      </Col>
    </Row>
    <Row>
      {tags.map((tag: ITag) => <Tag>{ tag.name }</Tag>)}
    </Row>
  </Card.Grid>
}

const Events: React.FC<{tagFilter: ITag[]}> = ({ tagFilter }) => {
  return <Query query={eventsQuery}>
    { ( {loading, error, data} ) => {
      if (loading) {
        return <div><Spin /></div>
      } else if (error) {
        return <div>Error</div>
      } else {
        return <Card>
          {
            data
              .events
              .filter((event: IEvent) =>
                !tagFilter.length || event.tags.filter((eventTag: ITag) => tagFilter.map((tag: ITag) => tag.name).includes(eventTag.name)).length
              )
              .map((event: IEvent) => 
                <Event event={event} />) 
          }
        </Card>
      }
    }}
  </Query>
}

const Filter: React.FC<{tags : ITag[], selected: ITag[], callback: any}> = ({ tags, selected, callback }) => {
  return <List>
    {tags
      .sort((t1, t2) => 
        t1.name.localeCompare(t2.name))
      .map((tag: ITag) => 
        <List.Item>
          <CheckableTag
            style={{
              'color': selected.includes(tag) ? '#004569' : "#888"
            }}
            checked={selected.includes(tag)} 
            onChange={(checked) => 
              callback( checked ? 
                selected.concat(tag) : 
                selected.filter((t: ITag) => 
                  t.name !== tag.name))}>
            { tag.name }
          </CheckableTag>
        </List.Item>)}
  </List>
}

const App: React.FC = () => {
  const [tagFilter, setTagFilter] = useState<ITag[]>([]);

  useEffect(() => {
    setTagFilter(tagFilter);
  }, [tagFilter])

  return (
    <div className="App">
      <Layout>
      <Header style={{backgroundColor: '#004569'}}>
        <a href="/">
          <img src="/images/header_logo.png" width="50px" height="50px" style={{float: 'left', marginTop: '5px'}}></img>
        </a>
        <a href="/">
          <Title style={ { 'color': '#eee', marginTop: '10px' } as React.CSSProperties }>Partyamt</Title>
        </a>
      </Header>
      <Layout>
        <Sider theme="light">
        <Query query={tagsQuery}>
            {({loading, error, data}) => {
              if (loading || error) {
                return <div></div>
              }
              else {
                return <Filter tags={data.tags} selected={tagFilter} callback={setTagFilter} />
              }
            }}
          </Query>
        </Sider>
        <Content>
          <Events tagFilter={tagFilter} />
        </Content>
      </Layout>
    </Layout>
    </div>
  );
}

export default App;
