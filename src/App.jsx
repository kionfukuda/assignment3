function ProductRow(props) {
  const product = props.product;
  return (
    <tr>
      <td>{product.name}</td>
      <td>${product.price}</td>
      <td>{product.category}</td>
      <a href="javascript:void(0)" onClick={()=> window.open(product.image)}><td width ="60">view</td></a>
    </tr>
  ); 
}

function ProductTable(props) {
  const productRows = props.products.map(product =>
    <ProductRow key={product.id} product={product} />
  );

  return (
    <table className="bordered-table">
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Price</th>
          <th>Category</th>
          <th>Image</th>
        </tr>
      </thead>
      <tbody>
        {productRows}
      </tbody>
    </table>
  );
}

class ProductAdd extends React.Component {
  constructor() {
    super();
    this.state = {value: 'shirts'};
    
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.productAdd;
    const product = {
      category: this.state.value , price: parseFloat(form.price.value.substring(1)), name: form.name.value, image: form.image.value, status: 'New',
    }
    this.props.createProduct(product);
    form.price.value = "$"; form.name.value = ""; form.image.value = "";
  }

  handleChange(e) {
    this.setState({value: e.target.value});
  }
  
  render() {
    return (
      <form name="productAdd" onSubmit={this.handleSubmit} style ={{fontSize:18}}>
        <div style = {{display:'inline-block', marginRight:'100px'}}> 
	        <label style={{}} for="category">Category <br />
            <select value={this.state.value} onChange={this.handleChange}  style = {{height:'25px', width: '160px'}}>
              <option value="shirts">Shirts</option>
              <option value="jeans">Jeans</option>
              <option value="jackets">Jackets</option>
              <option value="sweaters">Sweaters</option>
              <option value="accessories">Accessories</option>
            </select>
          </label>
        </div>
        <div style ={{display : 'inline-block', marginBottom:'10px'}}> 
	        <label for="price">Price Per Unit</label> <br />
          <input id="price" type="text" name="price" defaultValue={'$'} />
        </div>
        <br />
        <div style ={{display : 'inline-block', marginRight:'100px'}}> 
	        <label for="name">Product Name</label> <br />
          <input id="name" type="text" name="name" />
        </div>
        <div style ={{display : 'inline-block', marginBottom:'10px'}}> 
	        <label for="image">Image URL</label> <br />
          <input id="image" type="text" name="image" />
        </div>
        <br />
        <button>Add Product</button>
      </form>
    );
  }
}

async function graphQLFetch(query, variables = {}) {
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({ query, variables })
  });
  const body = await response.text();
  const result = JSON.parse(body);
  return result.data;
}

class ProductList extends React.Component {
  constructor() {
    super();
    this.state = { products: [] };
    this.createProduct = this.createProduct.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `query {
      productList {
        id category name price image
      }
    }`;

    const data = await graphQLFetch(query);
    if (data) {
      this.setState({ products: data.productList });
    }
  }


  async createProduct(product) {
    const query = `mutation {
      productAdd(product:{
        name: "${product.name}",
        price: ${product.price},
        image: "${image.url}",
      }) {
        id
      }
    }`;

    const data = await graphQLFetch(query, { product });
    if (data) {
      this.loadData();
    }
  }

  render() {
    return (
      <React.Fragment>
        <h1>My Company Inventory</h1>
        <p style={{fontSize:18}}>Showing all available products</p>
        <hr />
        <ProductTable products={this.state.products} />
        <p style={{fontSize:18}}>Add a new product to inventory</p>
        <hr />
	      <ProductAdd createProduct={this.createProduct} />
      </React.Fragment>
    );
  }
}

const element = <ProductList />;

ReactDOM.render(element, document.getElementById('contents'));