import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';


export const getDeckZoneSensor = gql`
  query getDeckZoneSensor {
    DeckZones(id:3) {
      DeckZoneID
      DeckZoneName
      DeckNumber
      DeckLocations {      
        SecurityDevices {       
          Equipments(EquipmentTypeName:"Deck Sensor") {
            EquipmentTypeName
          }
        }
      }
    }
  }
`;

export default () => (
  <Query query={getDeckZoneSensor}>
    {({ loading, data }) => !loading && (
      <table>
        <thead>
          <tr>
            <th>Author</th>
            <th>Body</th>
          </tr>
        </thead>
        <tbody>
          {data.DeckZones.map(post => (
            <tr key={post.DeckZoneName}>
              <td>{post.DeckZoneName}</td>
              <td>{post.DeckNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </Query>
);